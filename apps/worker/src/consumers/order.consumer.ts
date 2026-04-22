import { Channel, ConsumeMessage } from "amqplib";

import { logger } from "../utils/logger";
import { handleOrderCreated } from "../handlers/order.handler";

export const ORDER_CREATED_EVENT = "order.created";

export async function startOrderConsumer(channel: Channel) {
  await channel.assertQueue(ORDER_CREATED_EVENT, {
    durable: true,
  });

  channel.consume(
    ORDER_CREATED_EVENT,
    async (msg: ConsumeMessage | null) => {
      if (!msg) return;

      try {
        const data = JSON.parse(msg.content.toString());

        logger.info("Received order.created event");

        await handleOrderCreated(data);

        channel.ack(msg);
      } catch (err) {
        logger.error("Failed processing order.created", err);
        channel.nack(msg, false, false);
      }
    }
  );

  logger.info("Worker consuming order.created queue");
}