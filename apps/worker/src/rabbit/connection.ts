import amqp from "amqplib";

import { logger } from "../utils/logger";
export async function connectRabbit() {
  const connection = await amqp.connect(
    process.env.RABBIT_URL || "amqp://localhost"
  );

  const channel = await connection.createChannel();

  logger.info("Worker connected to RabbitMQ");

  return channel;
}