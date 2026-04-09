import type { Request, Response } from "express";

import { getConversations, getMessages } from "../services/chat.service.js";

export const getChatMessagesController = async (
  req: Request,
  res: Response
) => {
  const userId = req.user!.userId; // from auth middleware
const otherUserId = req.params.userId as string;
  const messages = await getMessages(userId, otherUserId);

  res.json({ messages });
};

export const getConversationsController = async (req:Request, res:Response) => {
  const userId = req.user!.userId;

  const data = await getConversations(userId);

  res.json({ conversations: data });
};

import { MessageModel } from "../models/chat.model.js"; // ✅ also required

export const markAsReadController = async (req:Request, res:Response) => {
  try {
    const userId = req.user!.userId; // ✅ FIXED
    const otherUserId = req.params.userId;

    const conversationId = [userId, otherUserId].sort().join("_");

    await MessageModel.updateMany(
      {
        conversationId,
        receiverId: userId,
        status: { $ne: "READ" }
      },
      {
        status: "READ"
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("markAsRead error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};