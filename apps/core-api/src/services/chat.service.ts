import mongoose from "mongoose";

import { MessageModel } from "../models/chat.model.js";
import { GigRequestModel } from "../models/gig-request.model.js";
import { OrderModel } from "../models/order.model.js";
import {
  findMessagesByGigRequest,
  aggregateConversations,
  addMessage
} from "../repositories/chat.repository.js";

//  Get messages by gigRequestId
export const getMessages = async (gigRequestId: string) => {
  return findMessagesByGigRequest(new mongoose.Types.ObjectId(gigRequestId));
};

//  Get all conversations for sidebar
export const getConversations = async (userId: string, role?: string) => {
  return aggregateConversations(userId, role);
};

//  Send message — only allowed on accepted gig requests
export const sendMessage = async (
  senderId: string,
  gigRequestId: string,
  content: string,
  messageType: "TEXT" | "PROPOSAL" = "TEXT",
  proposalData?: { date: Date; time: string; status: "PENDING" | "ACCEPTED" | "REJECTED" }
) => {
  const request = await GigRequestModel.findById(gigRequestId);

  if (!request) {
    throw new Error("Gig request not found");
  }

  if (request.status !== "accepted") {
    throw new Error("Chat is only available for accepted gig requests");
  }

  const receiverId = request.brandId.toString() === senderId
    ? request.influencerId.toString()
    : request.brandId.toString();

  const messageData = {
    gigRequestId: new mongoose.Types.ObjectId(gigRequestId),
    senderId,
    receiverId,
    content,
    status: "SENT",
    messageType,
    proposalData
  };

  return addMessage(messageData as {
    gigRequestId: mongoose.Types.ObjectId;
    senderId: string;
    receiverId: string;
    content: string;
    status: string;
    messageType?: string;
    proposalData?: Record<string, unknown>;
  });
}

export const respondToProposal = async (messageId: string, userId: string, status: "ACCEPTED" | "REJECTED") => {
  const message = await MessageModel.findById(messageId);

  if (!message) {
    throw new Error("Message not found");
  }

  if (message.messageType !== "PROPOSAL") {
    throw new Error("Target message is not a proposal");
  }

  if (message.receiverId.toString() !== userId) {
    throw new Error("Only the receiver can respond to this proposal");
  }

  if (message.proposalData?.status !== "PENDING") {
    throw new Error("Proposal is already processed");
  }

  message.proposalData.status = status;
  await message.save();

  // Create a system message for the agreement
  if (status === "ACCEPTED") {
    await addMessage({
      gigRequestId: message.gigRequestId,
      senderId: userId, // The one who accepted
      receiverId: message.senderId.toString(),
      content: `✅ Proposal Accepted: ${message.proposalData.date.toLocaleDateString()} at ${message.proposalData.time}`,
      status: "SENT",
      messageType: "TEXT"
    });
  }

  return message;
}

export const submitDeliverable = async (
  senderId: string,
  gigRequestId: string,
  deliverableData: { url: string; mediaType: "VIDEO" | "IMAGE" }
) => {
  const request = await GigRequestModel.findById(gigRequestId);
  if (!request) throw new Error("Gig request not found");

  // Only the influencer can submit deliverables
  if (request.influencerId.toString() !== senderId) {
    throw new Error("Only the influencer can submit deliverables");
  }

  // Find the associated order to ensure it's paid/in-escrow
  const order = await OrderModel.findOne({ connectionId: gigRequestId, status: "IN_ESCROW" });
  if (!order) throw new Error("No active escrow order found for this request");

  const receiverId = request.brandId.toString();

  const message = await addMessage({
    gigRequestId: new mongoose.Types.ObjectId(gigRequestId),
    senderId,
    receiverId,
    content: "Final deliverable submitted for review.",
    status: "SENT",
    messageType: "DELIVERABLE",
    deliverableData: {
      ...deliverableData,
      status: "PENDING"
    }
  });

  // Also update order workStatus
  order.workStatus = "SUBMITTED";
  order.deliverableUrl = deliverableData.url;
  await order.save();

  return message;
};

export const respondToDeliverable = async (
  messageId: string,
  userId: string,
  status: "ACCEPTED" | "REJECTED",
  rejectionNote?: string
) => {
  const message = await MessageModel.findById(messageId);
  if (!message) throw new Error("Message not found");
  if (message.messageType !== "DELIVERABLE") throw new Error("Message is not a deliverable");
  if (message.receiverId.toString() !== userId) throw new Error("Only the receiver can respond");
  if (!message.deliverableData || message.deliverableData.status !== "PENDING") throw new Error("Deliverable already processed or not found");

  message.deliverableData.status = status;
  if (status === "REJECTED") {
    message.deliverableData.rejectionNote = rejectionNote || "Revision requested";
  }
  await message.save();

  const order = await OrderModel.findOne({ connectionId: message.gigRequestId, status: "IN_ESCROW" });
  if (!order) throw new Error("Order not found");

  if (status === "ACCEPTED") {
    // 🔥 RELEASE ESCROW
    order.workStatus = "APPROVED";
    order.status = "COMPLETED";
    order.escrowStatus = "RELEASED";
    order.payoutStatus = "AVAILABLE";
    order.availableAt = new Date();
    await order.save();

    // Create system notification
    await addMessage({
      gigRequestId: message.gigRequestId,
      senderId: userId,
      receiverId: message.senderId.toString(),
      content: "Collaboration Successful! The order is now complete.",
      status: "SENT",
      messageType: "ORDER_COMPLETED"
    });
  } else {
    order.workStatus = "NOT_STARTED";
    await order.save();

    await addMessage({
      gigRequestId: message.gigRequestId,
      senderId: userId,
      receiverId: message.senderId.toString(),
      content: `❌ Deliverable Rejected. Reason: ${rejectionNote || "No note provided."}`,
      status: "SENT",
      messageType: "SYSTEM"
    });
  }

  return message;
}