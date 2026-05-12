export interface ChatMessageEvent {
  messageId: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  gigRequestId:string
}

export interface ChatMessageDocument {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatRealtimePayload {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export const isChatMessageEvent = (payload: unknown): payload is ChatMessageEvent => {
  const p = payload as Record<string, unknown>;
  return (
    typeof p === 'object' &&
    p !== null &&
    typeof p.messageId === 'string' &&
    typeof p.conversationId === 'string' &&
    typeof p.senderId === 'string' &&
    typeof p.receiverId === 'string' &&
    typeof p.content === 'string' &&
    typeof p.createdAt === 'string'
  );
};
