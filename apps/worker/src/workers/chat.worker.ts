import { Worker, Job } from "bullmq";

import { redis as redisConnection } from "../cache/redis.js";
import { notificationQueue } from "../queue/notification.queue.js";
import { ChatMessageEvent, isChatMessageEvent } from "../types/chat.types.js";

const REALTIME_URL = process.env.REALTIME_URL || "http://localhost:6001";

export const chatWorker = new Worker<
  ChatMessageEvent,
  void,
  "chat-message-created"
>(
  "chat-message",
  async (job: Job<ChatMessageEvent>) => {
    const data = job.data;

    if (!isChatMessageEvent(data)) {
      throw new Error(`Invalid job data: ${job.id}`);
    }

    const {
      messageId,
      gigRequestId,
      senderId,
      receiverId,
      content,
      createdAt,
    } = data;

    const payload = {
      _id: messageId,
      gigRequestId,
      senderId,
      content,
      createdAt,
    };

    try {
      const emit = async (room: string) => {
        await fetch(`${REALTIME_URL}/internal/emit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-internal-secret": process.env.INTERNAL_SECRET || "",
          },
          body: JSON.stringify({
            event: "chat:new-message",
            room,
            payload,
          }),
        });
      };

      // 🔥 match your realtime rooms
      await emit(`gig:${gigRequestId}`);
      await emit(`user:${receiverId}`);

    } catch (error) {
      console.error("❌ Realtime emit failed", error);
    }

    // 🔔 trigger notification worker
    if (senderId !== receiverId) {
      await notificationQueue.add(
        "new-message",
        {
          receiverId,
          gigRequestId,
        },
        {
          jobId: `notification-msg-${messageId}`,
        }
      );
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

chatWorker.on("completed", (job) => {
  console.log(`✅ Chat job done: ${job.id}`);
});

chatWorker.on("failed", (job, err) => {
  console.error(`❌ Chat job failed: ${job?.id}`, err);
});