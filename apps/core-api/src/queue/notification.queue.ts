import { Queue } from "bullmq";
import type { ConnectionOptions } from "bullmq";

import { redis } from "../cache/redis.js";

export const notificationQueue = new Queue("notification-queue", {
  connection: redis as unknown as ConnectionOptions,
});
// import { Queue } from "bullmq";
// import { redis } from "../cache/redis.js";

// export const notificationQueue = new Queue("notification-queue", {
//   connection: redis as any,
// });
