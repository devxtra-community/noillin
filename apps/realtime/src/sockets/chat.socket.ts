import { Server, Socket } from "socket.io";

  import { MessageModel } from "../../../core-api/src/models/chat.model";
import { generateConversationId } from "../../../core-api/src/utils/chat.utils";


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

  const conversationId = generateConversationId(userId, receiverId);

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