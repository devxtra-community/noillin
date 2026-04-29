import type { Request, Response } from "express";
import mongoose from "mongoose";

import { getConversations, getMessages, sendMessage, respondToProposal } from "../services/chat.service.js";
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
    const { gigRequestId, content, messageType, proposalData } = req.body;

    const message = await sendMessage(senderId, gigRequestId, content, messageType, proposalData);

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

export const respondToProposalController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const messageId = req.params.messageId;
    const { status } = req.body; // "ACCEPTED" | "REJECTED"

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const message = await respondToProposal(messageId, userId, status);

    res.json({ success: true, message });
  } catch (err: unknown) {
    console.error("respondToProposal error:", err);
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getAgreedProposalsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    // Find messages where type=PROPOSAL, status=ACCEPTED and user is sender or receiver
    const proposals = await MessageModel.find({
      messageType: "PROPOSAL",
      "proposalData.status": "ACCEPTED",
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).populate("gigRequestId");

    res.json({ proposals });
  } catch (err) {
    console.error("getAgreedProposals error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};