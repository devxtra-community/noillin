import { publishEvent } from "src/queue/publisher.js";

import { OrderModel } from "../models/order.model.js";

export const createOrderService = async (data: Record<string, unknown>) => {
  const order = await OrderModel.create({
    ...data,
    status: "PENDING",
  });
await publishEvent("order.created", {
  orderId: order._id.toString(),
  buyerId: order.buyerId,
  influencerId: order.influencerId,
  amount: order.amount,
});
console.log("🚀 order.created event published");
  return {
    orderId: order._id,
    amount: order.amount,
  };
};