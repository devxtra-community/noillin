/**
 * room.utils.ts
 * 
 * Centralized helpers for generating consistent Socket.io room names.
 * Every user gets their own personal room: "user:<userId>"
 * 
 * Why a utility? So every part of the app uses the same format —
 * if we ever change the naming convention, we change it in ONE place.
 */

/**
 * Get the personal room name for a user.
 * Every socket connection joins this room on connect.
 */
export const getUserRoom = (userId: string): string => `user:${userId}`;

/**
 * Get a shared room for a specific gig request conversation.
 * Both the brand and influencer join this room when they open a chat.
 * Allows broadcasting to everyone in a conversation at once.
 */
export const getConversationRoom = (gigRequestId: string): string =>
    `conversation:${gigRequestId}`;
