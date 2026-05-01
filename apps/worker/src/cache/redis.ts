import IORedis from "ioredis";
import type { Redis } from "ioredis";

import { logger } from "../utils/logger.js";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is not defined in environment variables");
}

export const redis: Redis = new IORedis(redisUrl, {
  maxRetriesPerRequest: null, // ✅ REQUIRED FOR BULLMQ
});

redis.on("connect", () => {
  logger.info("Redis connected successfully");
});

redis.on("reconnecting", () => {
  logger.warn("Redis reconnecting...");
});

redis.on("error", (err: unknown) => {
  logger.error(`Redis error: ${String(err)}`);
});
// import IORedis from "ioredis";

// import { logger } from "../utils/logger";

// const redisUrl = process.env.REDIS_URL;

// if (!redisUrl) {
//   throw new Error("REDIS_URL is not defined");
// }

// export const redis = new IORedis(redisUrl);

// redis.on("connect", () => {
//   logger.info("Redis connected (Worker)");
// });

// redis.on("error", (err) => {
//   logger.error("Redis error (Worker)", err);
// });