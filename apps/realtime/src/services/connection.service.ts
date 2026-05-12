/**
 * connection.service.ts (Realtime Service)
 *
 * Manages the in-memory registry of which users are currently online
 * and which socket IDs they have open (multiple tabs = multiple socket IDs).
 *
 * Why in-memory? Socket presence is ephemeral by nature.
 * We don't need to persist this to DB — it resets when the server restarts.
 *
 * Data shape:
 *   onlineUsers = Map {
 *     "userId123" => ["socketId_tab1", "socketId_tab2"],
 *     "userId456" => ["socketId_tab1"],
 *   }
 */

// userId → array of active socket IDs (one per open browser tab)
const onlineUsers = new Map<string, string[]>();

/**
 * Register a new socket connection for a user.
 * Called when a socket connects and sends their userId.
 */
export const registerUserSocket = (userId: string, socketId: string): void => {
    const existing = onlineUsers.get(userId) ?? [];
    if (!existing.includes(socketId)) {
        existing.push(socketId);
    }
    onlineUsers.set(userId, existing);
};

/**
 * Remove a specific socket from a user's connection list.
 * Called on socket disconnect. If no sockets remain, the user is offline.
 */
export const removeUserSocket = (userId: string, socketId: string): void => {
    const existing = onlineUsers.get(userId) ?? [];
    const updated = existing.filter((id) => id !== socketId);

    if (updated.length === 0) {
        onlineUsers.delete(userId); // fully offline
    } else {
        onlineUsers.set(userId, updated);
    }
};

/**
 * Check if a user has at least one active socket connection.
 */
export const isUserOnline = (userId: string): boolean =>
    (onlineUsers.get(userId)?.length ?? 0) > 0;

/**
 * Get all active socket IDs for a user.
 */
export const getUserSockets = (userId: string): string[] =>
    onlineUsers.get(userId) ?? [];

/**
 * Get a snapshot of all currently online user IDs.
 * Useful for debugging or presence broadcasts.
 */
export const getOnlineUserIds = (): string[] =>
    Array.from(onlineUsers.keys());
