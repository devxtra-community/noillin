import Order from "../models/order.model.js";

export const createOrderService = async (data: Record<string, unknown>) => {
  const order = await Order.create({
    ...data,
    status: "PENDING",
  });

  return {
    orderId: order._id,
    amount: order.amount,
  };
};