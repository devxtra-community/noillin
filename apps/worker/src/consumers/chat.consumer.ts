import { Channel, ConsumeMessage } from "amqplib";

import { chatMessageQueue } from "../queue/chat.queue.js";
import { isChatMessageEvent } from "../types/chat.types.js";

export const consumeChatMessages = async (channel: Channel): Promise<void> => {
  const exchange = "chat.events";
  const queue = "chat.message.sent.queue";
  const routingKey = "chat.message.sent";

  await channel.assertExchange(exchange, "topic", { durable: true });
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, routingKey);

  await channel.consume(queue, async (msg: ConsumeMessage | null) => {
    if (!msg) return;

    try {
      const payload: unknown = JSON.parse(msg.content.toString());

      if (!isChatMessageEvent(payload)) {
        console.error("Invalid chat message payload received from RabbitMQ", payload);
        channel.ack(msg);
        return;
      }

      await chatMessageQueue.add(
        "chat-message-created",
        payload,
        {
          jobId: `chat-msg-${payload.messageId}`, 
        }
      );

      channel.ack(msg);
    } catch (error) {
      console.error("Error processing chat message from RabbitMQ", error);
      channel.nack(msg, false, false);
    }
  });
};
