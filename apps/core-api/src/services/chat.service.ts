import {
  findMessagesByConversation,
  aggregateConversations
} from "../repositories/chat.repository.js";

export const getMessages = async (
  userA: string,
  userB: string
) => {
  const conversationId = [userA, userB].sort().join("_");

  return findMessagesByConversation(conversationId);
};

export const getConversations = async (userId: string) => {
  return aggregateConversations(userId);
};