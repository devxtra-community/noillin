import IORedis from "ioredis";
import type {Redis} from "ioredis";

import { logger } from "../utils/logger.js";
const redis_url = process.env.REDIS_URL
if (!redis_url){
    throw new Error("REDIS_URL is not defined in environment variables")
}
export const redis:Redis = new IORedis.default(redis_url)
redis.on("connect", ()=>{
    logger.info("Redis connected successfully")
})

redis.on("reconnecting", () => {
  logger.warn("Redis reconnecting...");
});

redis.on("error", (err:unknown)=>{
    logger.error(`Redis error:${String(err)}`)
})
