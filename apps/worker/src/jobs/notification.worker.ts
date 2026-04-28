import { Worker } from "bullmq";

import { logger } from "../utils/logger";

console.log("🚀 Notification Worker started");

export const notificationWorker = new Worker(
  "notification-queue",
  async (job) => {
    console.log("🔥 JOB RECEIVED:", job.name);
    console.log("📦 JOB DATA:", job.data);

    if (job.name === "order-created") {
      console.log("🔔 Processing notification...");

      await new Promise((res) => setTimeout(res, 500));

      logger.info(
        `Notification processed for order ${job.data.orderId}`
      );
    }
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);

notificationWorker.on("completed", (job) => {
  console.log(`✅ Job completed: ${job.id}`);
});

notificationWorker.on("failed", (job, err) => {
  console.error(`❌ Job failed: ${job?.id}`, err);
});