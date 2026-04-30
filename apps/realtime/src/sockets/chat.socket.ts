import { Server, Socket } from "socket.io";

import { getUserRoom, getConversationRoom } from "../utils/room.utils.js";
import {
  registerUserSocket,
  removeUserSocket,
} from "../services/connection.service.js";
import { emitNewMessage, emitMessagesRead, emitProposalUpdate } from "../services/emit.service.js";

/**
 * chat.socket.ts
 *
 * Registers all Socket.io event handlers for the chat feature.
 * This file is the "router" — it receives raw socket events and
 * delegates to the proper services/utilities.
 *
 * Events this file handles (incoming from clients):
 *   - "join_conversation"    → join a conversation room
 *   - "leave_conversation"   → leave a conversation room
 *   - "send_message"         → relay a saved message to participants
 *   - "mark_read"            → notify sender their messages were read
 *   - "disconnect"           → clean up user's socket registration
 */
export const registerChatHandlers = (io: Server, socket: Socket): void => {

  // ──────────────────────────────────────────
  // STEP 1: Identify the connecting user
  // ──────────────────────────────────────────
  const userId: string | undefined =
    socket.handshake.auth?.userId ||
    (socket.handshake.query?.userId as string | undefined);

  if (!userId) {
    console.warn(`[socket] No userId provided — disconnecting ${socket.id}`);
    socket.disconnect();
    return;
  }

  // ──────────────────────────────────────────
  // STEP 2: Join the user's personal room
  // Every user has a dedicated room: "user:<userId>"
  // This lets us send them messages even without them explicitly
  // joining a conversation room.
  // ──────────────────────────────────────────
  const personalRoom = getUserRoom(userId);
  socket.join(personalRoom);

  // ──────────────────────────────────────────
  // STEP 3: Register in online users map
  // Tracks which socket IDs belong to which user (for multi-tab support)
  // ──────────────────────────────────────────
  registerUserSocket(userId, socket.id);
  console.log(`[socket] User ${userId} connected → room: ${personalRoom}`);

  // ──────────────────────────────────────────
  // EVENT: join_conversation
  // Called when user opens a specific chat window.
  // Joins a shared conversation room so mark-read events propagate.
  // ──────────────────────────────────────────
  socket.on("join_conversation", (gigRequestId: string) => {
    if (!gigRequestId) return;
    const room = getConversationRoom(gigRequestId);
    socket.join(room);
    console.log(`[socket] User ${userId} joined conversation room: ${room}`);
  });

  // ──────────────────────────────────────────
  // EVENT: leave_conversation
  // Called when user navigates away from a chat window.
  // ──────────────────────────────────────────
  socket.on("leave_conversation", (gigRequestId: string) => {
    if (!gigRequestId) return;
    const room = getConversationRoom(gigRequestId);
    socket.leave(room);
    console.log(`[socket] User ${userId} left conversation room: ${room}`);
  });

  // ──────────────────────────────────────────
  // EVENT: send_message
  // Called AFTER core-api has already saved the message to DB.
  // The frontend passes the saved message object (with real _id).
  // We relay it to the receiver and sender's other tabs.
  // ──────────────────────────────────────────
  socket.on("send_message", (data: {
    message: {
      _id: string;
      gigRequestId: string;
      senderId: string;
      receiverId: string;
      content: string;
      status: string;
      createdAt: string;
    }
  }) => {
    const { message } = data;

    if (!message || !message.receiverId || !message.senderId) {
      console.warn("[socket] send_message: invalid message payload, skipping");
      return;
    }

    console.log(`[socket] Relaying message ${message._id} from ${message.senderId} → ${message.receiverId}`);
    emitNewMessage(io, message);
  });

  // ──────────────────────────────────────────
  // EVENT: mark_read
  // Called when a user opens a conversation (they've read the messages).
  // Notifies the sender that their messages have been seen (double blue tick).
  // ──────────────────────────────────────────
  socket.on("mark_read", (gigRequestId: string) => {
    if (!gigRequestId) return;
    console.log(`[socket] User ${userId} marked ${gigRequestId} as read`);
    emitMessagesRead(io, gigRequestId, userId);
  });

  socket.on("proposal_update", (data: { gigRequestId: string; message: unknown }) => {
    const { gigRequestId, message } = data;
    if (!gigRequestId || !message) return;
    console.log(`[socket] Relaying proposal update for gigRequest ${gigRequestId}`);
    emitProposalUpdate(io, gigRequestId, message);
  });

  // ──────────────────────────────────────────
  // EVENT: disconnect
  // Clean up: remove this socket from the user's tracked connections.
  // If no other sockets remain, the user is marked as offline.
  // ──────────────────────────────────────────
  socket.on("disconnect", () => {
    removeUserSocket(userId, socket.id);
    console.log(`[socket] User ${userId} disconnected socket ${socket.id}`);
  });
};