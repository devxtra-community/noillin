import { Channel, ConsumeMessage } from "amqplib";

import { handleGigRequestAccepted, handleGigRequestCreated, handleGigRequestRejected } from "../handlers/gig-request.handler.js";
import { logger } from "../utils/logger.js";
import { GIG_REQUEST_ACCEPTED_EVENT, GIG_REQUEST_CREATED_EVENT, GIG_REQUEST_REJECTED_EVENT } from "../../../core-api/src/queue/events.js";

export async function startGigRequestConsumer(channel: Channel) {
  await channel.assertQueue(GIG_REQUEST_CREATED_EVENT, { durable: true });
  await channel.assertQueue(GIG_REQUEST_ACCEPTED_EVENT, { durable: true });
await channel.assertQueue(GIG_REQUEST_REJECTED_EVENT, { durable: true });

  channel.consume(
    GIG_REQUEST_CREATED_EVENT,
    async (msg: ConsumeMessage | null) => {
      if (!msg) return;

      try {
        const data = JSON.parse(msg.content.toString());

        await handleGigRequestCreated(data);

        channel.ack(msg);
      } catch (err) {
        logger.error("Failed processing gig_request.created", err);
        // Do not requeue for now
        channel.nack(msg, false, false);
      }
    }
  );

  logger.info("Worker consuming gig_request.created queue");


  // ✅ ACCEPTED
  channel.consume(GIG_REQUEST_ACCEPTED_EVENT, async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());
      await handleGigRequestAccepted(data);
      channel.ack(msg);
    } catch (err) {
      logger.error("Failed processing gig_request.accepted", err);
      channel.nack(msg, false, false);
    }
  });

  // ✅ REJECTED
  channel.consume(GIG_REQUEST_REJECTED_EVENT, async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());
      await handleGigRequestRejected(data);
      channel.ack(msg);
    } catch (err) {
      logger.error("Failed processing gig_request.rejected", err);
      channel.nack(msg, false, false);
    }
  });

  logger.info("Worker consuming gig_request queues (created, accepted, rejected)");

}
