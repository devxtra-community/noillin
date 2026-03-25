import { Channel, ConsumeMessage } from "amqplib";

import { handleBrandCreated } from "../handlers/brand.handler.js";
import { BRAND_CREATED_EVENT } from "../../../core-api/src/queue/events.js";
import { logger } from "../utils/logger.js";

export async function startBrandConsumer(channel: Channel) {
  await channel.assertQueue(BRAND_CREATED_EVENT, { durable: true });

  channel.consume(
    BRAND_CREATED_EVENT,
    async (msg: ConsumeMessage | null) => {
      if (!msg) return;

      try {
        const data = JSON.parse(msg.content.toString());

        await handleBrandCreated(data);

        channel.ack(msg);
      } catch (err) {
        logger.error("Failed processing brand.created", err);
        channel.nack(msg, false, true);
      }
    }
  );
}