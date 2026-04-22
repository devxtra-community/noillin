import { Server, Socket } from "socket.io";



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

socket.on("send_message", (data) => {
  const { message } = data;

  if (!message || !message.receiverId) return;

  const receiverRoom = `user:${message.receiverId}`;
  const senderRoom = `user:${userId}`;

  // Broadcast to receiver and sender's other tabs
  console.log(`Relaying message from ${userId} to room ${receiverRoom}`);
  io.to(receiverRoom).emit("receive_message", message);
  io.to(senderRoom).emit("receive_message", message);


  console.log("Message relayed via socket:", message._id);
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