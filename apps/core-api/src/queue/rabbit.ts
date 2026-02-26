import amqp, { type Channel } from "amqplib";

import { logger } from "../utils/logger.js";
import type { HttpError } from "../modules/auth/http-error.js";

const rabbitUrl = process.env.RABBIT_URL as string;

let channel: Channel | null = null; 


export const connectRabbit = async () => {
  if (!rabbitUrl) {
    console.warn("RabbitMQ disabled: RABBIT_URL not set");
    return;
  }

  try {
    const connection = await amqp.connect(rabbitUrl);
    channel = await connection.createChannel();

    logger.info("RabbitMQ connected (Core API)");

    connection.on("error", (err) => {
      logger.error("RabbitMQ connection error", err);
    });

    connection.on("close", () => {
      logger.warn("RabbitMQ connection closed");
    });

  } catch (err: unknown) {
    logger.error(`RabbitMQ connection failed ${String(err)}`);
  }
};

export function getChannel():Channel{
  if(!channel){
    const err =new Error("RabbitMQ channel not initialized") as HttpError;
    throw err;
  }
  return channel;
}