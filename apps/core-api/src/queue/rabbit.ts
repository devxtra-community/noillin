import amqp, { type Channel } from "amqplib";

import { logger } from "../utils/logger.js";

const rabbitUrl = process.env.RABBIT_URL as string;

export let channel: Channel;


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