import { ConversationModel } from "../models/conversation.model.js";
import {
  findMessagesByConversation,
  aggregateConversations,
  addMessage
} from "../repositories/chat.repository.js";

// 🟢 Get messages between two users (via conversation)
export const getMessages = async (
  userA: string,
  userB: string
) => {
  // 🔥 Step 1: find conversation using participants
  const conversation = await ConversationModel.findOne({
    participants: { $all: [userA, userB] },
  });

  // 🔥 Step 2: if no conversation → no messages
  if (!conversation) {
    return [];
  }

  // 🔥 Step 3: fetch messages using conversationId (ObjectId)
  return findMessagesByConversation(conversation._id);
};

// 🟡 Get all conversations for sidebar
export const getConversations = async (userId: string) => {
  return aggregateConversations(userId);
};

// 🔵 Send message
export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
    // 1. Find or create conversation
    let conversation = await ConversationModel.findOne({
        participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
        conversation = await ConversationModel.create({
            participants: [senderId, receiverId],
            // Note: connectionId might be null for direct chats not linked to a booking
        });
    }

    // 2. Save message
    return addMessage({
        conversationId: conversation._id,
        senderId,
        receiverId,
        content,
        status: "SENT"
    });
}