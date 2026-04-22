import type { OrderCreatedEvent } from "../types/events.types";

export async function handleOrderCreated(data: OrderCreatedEvent) {
  console.log("Order created:", data.orderId);

  // future:
  // await createNotification(...)
}