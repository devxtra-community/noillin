import type { Request, Response } from "express";
import mongoose from "mongoose";

import { getConversations, getMessages, sendMessage } from "../services/chat.service.js";
import { MessageModel } from "../models/chat.model.js";

//  Get messages for a gig request
export const getChatMessagesController = async (
  req: Request,
  res: Response
) => {
  try {
    const gigRequestId = req.params.gigRequestId as string;

    const messages = await getMessages(gigRequestId);

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
    const { gigRequestId, content } = req.body;

    const message = await sendMessage(senderId, gigRequestId, content);

    res.json({ success: true, message });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("sendMessage error:", err);
    if (err.message === "Chat is only available for accepted gig requests") {
      return res.status(403).json({ message: err.message });
    }
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
    const role = (req.query.role as string) || undefined;

    const data = await getConversations(userId, role);

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
    const gigRequestId = req.params.gigRequestId as string;

    await MessageModel.updateMany(
      {
        gigRequestId: new mongoose.Types.ObjectId(gigRequestId),
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