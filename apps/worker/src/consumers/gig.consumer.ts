import { Channel, ConsumeMessage } from "amqplib";

import { handleGigCreated } from "../handlers/gig.handler";
import { logger } from "../utils/logger";

export const GIG_CREATED_EVENT = "gig.created";

export async function startGigConsumer(channel: Channel) {
  await channel.assertQueue(GIG_CREATED_EVENT, {
    durable: true,
  });

  channel.prefetch(1);

  channel.consume(
    GIG_CREATED_EVENT,
    async (msg: ConsumeMessage | null) => {
      if (!msg) return;

      try {
        const data = JSON.parse(
          msg.content.toString()
        );

        await handleGigCreated(data);
        channel.ack(msg);
      } catch (err) {
        logger.error("Failed processing gig.created", err);

        channel.nack(msg, false, true); // simple requeue
      }
    },
    { noAck: false }
  );

  logger.info("Worker consuming gig.created queue");
}