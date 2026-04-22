import type { Request, Response } from "express";
import mongoose from "mongoose";

import { getConversations, getMessages, sendMessage } from "../services/chat.service.js";
import { MessageModel } from "../models/chat.model.js";

//  Get messages between two users
export const getChatMessagesController = async (
  req: Request,
  res: Response
) => {
  try {
    const connectionId = req.params.connectionId as string;

    const messages = await getMessages(connectionId);

    res.json({ messages });
  } catch (err) {
    console.error("getChatMessages error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Send message (REST fallback)
export const sendMessageController = async (req: Request, res: Response) => {
  try {
    const senderId = req.user!.userId;
    const { connectionId, content } = req.body;

    const message = await sendMessage(senderId, connectionId, content);

    res.json({ success: true, message });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Get all conversations (sidebar)
export const getConversationsController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user!.userId;

    const data = await getConversations(userId);

    res.json({ conversations: data });
  } catch (err) {
    console.error("getConversations error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Mark messages as READ
export const markAsReadController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user!.userId;
    const connectionId = req.params.connectionId as string;

    //  UPDATE MESSAGES USING connectionId
    await MessageModel.updateMany(
      {
        connectionId: new mongoose.Types.ObjectId(connectionId),
        receiverId: userId,
        status: { $ne: "READ" },
      },
      {
        status: "READ",
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("markAsRead error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};