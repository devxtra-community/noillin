// core-api/src/queue/publisher.ts

import { getChannel } from "./rabbit.js";

export async function publishEvent(queue: string, data: unknown) {
  const channel = getChannel();

  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }

  channel.sendToQueue(
    queue,
    Buffer.from(JSON.stringify(data)),
    { persistent: true }
  );
}