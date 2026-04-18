import { Server, Socket } from "socket.io";

import { MessageModel } from "../../../core-api/src/models/chat.model";
import { ConversationModel } from "../../../core-api/src/models/conversation.model";


const onlineUsers = new Map<string, string[]>();

export const registerChatHandlers = (io: Server, socket: Socket) => {
  console.log("New socket connected:", socket.id);

  // 🔑 STEP 1: Get userId FIRST
//   const userId = socket.handshake.auth?.userId;
    const userId =
  socket.handshake.auth?.userId ||
  socket.handshake.query?.userId;

  if (!userId) {
    console.log("No userId, disconnecting");
    socket.disconnect();
    return;
  }

  // 🔑 STEP 2: Join room
  const room = `user:${userId}`;
  socket.join(room);

  // 🔑 STEP 3: Track user
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, []);
  }

  onlineUsers.get(userId)!.push(socket.id);

  console.log(`User ${userId} joined room ${room}`);

socket.on("send_message", async (data) => {
  const { receiverId, content } = data;

  if (!receiverId || !content) return;

  // 🔥 FIND REAL CONVERSATION (instead of string ID)
  const conversation = await ConversationModel.findOne({
    participants: { $all: [userId, receiverId] },
  });

  // Fallback if not found (legacy or special cases)
  const conversationId = conversation ? conversation._id : [userId, receiverId].sort().join("_");

  // ✅ save message
  const message = await MessageModel.create({
    conversationId,
    senderId: userId,
    receiverId,
    content,
    status: "SENT"
  });

  const receiverRoom = `user:${receiverId}`;

  // ✅ check if receiver is online
  const isReceiverOnline = onlineUsers.has(receiverId);

  let finalStatus: "SENT" | "DELIVERED" = "SENT";

  if (isReceiverOnline) {
    finalStatus = "DELIVERED";

    await MessageModel.findByIdAndUpdate(message._id, {
      status: "DELIVERED"
    });
  }

  // ✅ send correct status
  const updatedMessage = {
    ...message.toObject(),
    status: finalStatus
  };

  io.to(receiverRoom).emit("receive_message", updatedMessage);
  io.to(`user:${userId}`).emit("receive_message", updatedMessage);

  console.log("Message saved + sent:", message._id);
});
  // 🔌 DISCONNECT
 socket.on("disconnect", () => {
  const sockets = onlineUsers.get(userId) || [];

  const updated = sockets.filter((id) => id !== socket.id);

  if (updated.length === 0) {
    onlineUsers.delete(userId); // ✅ fully offline
  } else {
    onlineUsers.set(userId, updated);
  }
});
};