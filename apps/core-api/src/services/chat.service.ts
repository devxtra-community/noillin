import mongoose from "mongoose";

import { MessageModel } from "../models/chat.model.js";
import { GigRequestModel } from "../models/gig-request.model.js";
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

  return addMessage({
    gigRequestId: new mongoose.Types.ObjectId(gigRequestId),
    senderId,
    receiverId,
    content,
    status: "SENT",
    // @ts-expect-error - repository needs update too
    messageType,
    proposalData
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