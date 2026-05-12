import { Queue } from "bullmq";

import { redis } from "../cache/redis.js";

export const notificationQueue = new Queue("notification-queue", {
  connection: redis,
});