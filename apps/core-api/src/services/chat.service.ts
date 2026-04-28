import mongoose from "mongoose";

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
export const sendMessage = async (senderId: string, gigRequestId: string, content: string) => {
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
    status: "SENT"
  });
}