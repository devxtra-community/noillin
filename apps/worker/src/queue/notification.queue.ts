import { Queue } from "bullmq";

import { redis } from "../cache/redis";

export const notificationQueue = new Queue("notification-queue", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});