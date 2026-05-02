import { Queue } from "bullmq";

import { redis as redisConnection } from "../cache/redis.js";
import { ChatMessageEvent } from "../types/chat.types.js";

export const chatMessageQueue = new Queue<ChatMessageEvent, void, "chat-message-created">(
  "chat-message",
  {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    },
  }
);
