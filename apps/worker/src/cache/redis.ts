import IORedis from "ioredis";

import { logger } from "../utils/logger";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is not defined");
}

export const redis = new IORedis(redisUrl);

redis.on("connect", () => {
  logger.info("Redis connected (Worker)");
});

redis.on("error", (err) => {
  logger.error("Redis error (Worker)", err);
});