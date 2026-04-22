import mongoose from "mongoose";

import { ConnectionModel } from "../models/connection.model.js";
import {
  findMessagesByConnection,
  aggregateConversations,
  addMessage
} from "../repositories/chat.repository.js";

//  Get messages by connectionId
export const getMessages = async (connectionId: string) => {
  return findMessagesByConnection(new mongoose.Types.ObjectId(connectionId));
};

//  Get all conversations for sidebar
export const getConversations = async (userId: string) => {
  return aggregateConversations(userId);
};

//  Send message by connectionId
export const sendMessage = async (senderId: string, connectionId: string, content: string) => {
    const connection = await ConnectionModel.findById(connectionId);

    if (!connection) {
        throw new Error("Connection not found");
    }

    const receiverId = connection.brandId.toString() === senderId 
        ? connection.influencerId.toString() 
        : connection.brandId.toString();

    return addMessage({
        connectionId: new mongoose.Types.ObjectId(connectionId),
        senderId,
        receiverId,
        content,
        status: "SENT"
    });
}