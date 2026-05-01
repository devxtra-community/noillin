import { Server } from "socket.io";

import { getUserRoom, getConversationRoom } from "../utils/room.utils.js";

/**
 * emit.service.ts
 *
 * All outgoing socket broadcasts are handled here.
 * Instead of calling io.to(...).emit(...) scattered everywhere,
 * we have named functions that read like plain English.
 *
 * Why? Makes it easy to trace exactly what events exist,
 * what data they carry, and when they fire.
 */

/**
 * Deliver a saved message to both participants in real-time.
 *
 * Emits to:
 *   - receiver's personal room (the other person's screen)
 *   - sender's personal room (so their other open tabs update)
 *   - conversation room (so any future listeners on the chat room also get it)
 */
export const emitNewMessage = (
    io: Server,
    message: {
        _id: string;
        gigRequestId: string;
        senderId: string;
        receiverId: string;
        content: string;
        status: string;
        createdAt: Date | string;
    }
): void => {
    const receiverRoom = getUserRoom(message.receiverId);
    const senderRoom = getUserRoom(message.senderId);
    const convRoom = getConversationRoom(message.gigRequestId.toString());

    // Push to receiver's screen
    io.to(receiverRoom).emit("receive_message", message);

    // Push to sender's other tabs (prevents duplicate via optimistic UI)
    io.to(senderRoom).emit("receive_message", message);

    // Push to conversation room (for future multi-device support)
    io.to(convRoom).emit("receive_message", message);
};

/**
 * Notify both users in a conversation that all messages have been read.
 * This triggers the double-tick (✓✓) turning blue on the sender's side.
 */
export const emitMessagesRead = (
    io: Server,
    gigRequestId: string,
    readByUserId: string
): void => {
    const convRoom = getConversationRoom(gigRequestId);
    io.to(convRoom).emit("messages_read", { gigRequestId, readByUserId });
};

/**
 * Notify all participants that a proposal has been accepted or rejected.
 */
export const emitProposalUpdate = (
    io: Server,
    gigRequestId: string,
    message: unknown
): void => {
    const convRoom = getConversationRoom(gigRequestId);
    io.to(convRoom).emit("receive_proposal_update", message);
};

/**
 * Notify a specific user about an unread count update.
 * Used to refresh their sidebar badge without a full page reload.
 */
export const emitUnreadUpdate = (
    io: Server,
    userId: string,
    gigRequestId: string,
    unreadCount: number
): void => {
    io.to(getUserRoom(userId)).emit("unread_update", { gigRequestId, unreadCount });
};
