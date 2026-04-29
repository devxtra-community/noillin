

import type { OrderCreatedEvent } from "../types/events.types";
import { notificationQueue } from "../queue/notification.queue";

export async function handleOrderCreated(data: OrderCreatedEvent) {
  console.log("Order created:", data.orderId);

  await notificationQueue.add("order-created", {
    orderId: data.orderId,
    buyerId: data.buyerId,
    influencerId: data.influencerId,
    amount: data.amount,
  });

  console.log("✅ Job added to notification queue");
}