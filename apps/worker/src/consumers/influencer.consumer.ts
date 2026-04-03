import { Channel, ConsumeMessage } from "amqplib";

import { handleInfluencerCreated } from "../handlers/influencer.handler.js";
import { INFLUENCER_CREATED_EVENT } from "../../../core-api/src/queue/events.js";
import { logger } from "../utils/logger.js";

export async function startInfluencerConsumer(channel: Channel) {
  await channel.assertQueue(INFLUENCER_CREATED_EVENT, {
    durable: true,
  });

  channel.prefetch(1);

  channel.consume(
    INFLUENCER_CREATED_EVENT,
    async (msg: ConsumeMessage | null) => {
      if (!msg) return;

      try {
        const data = JSON.parse(msg.content.toString());

        await handleInfluencerCreated(data);

        channel.ack(msg);
      } catch (error) {
        logger.error("Error processing influencer.created", error);
        channel.nack(msg, false, true);
      }
    },
    { noAck: false }
  );

  logger.info("Worker consuming influencer.created queue");
}