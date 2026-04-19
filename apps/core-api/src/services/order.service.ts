import mongoose, { Types } from "mongoose";

import { OrderModel } from "../models/order.model.js";
import { GigModel } from "../models/gig.model.js";

// ✅ Define input type
interface CreateOrderInput {
  gigId: string;
  buyerId: string;
  influencerId: string;
  amount?: number;
  connectionId: string;
}

// 🟢 CREATE ORDER
export const createOrderService = async (data: CreateOrderInput) => {
  const { gigId, buyerId, influencerId, amount, connectionId } = data;

  // 🔥 STEP 1: Validate connection exists
  const connection = await mongoose
    .model("Connection")
    .findById(new Types.ObjectId(connectionId));

  if (!connection) {
    throw new Error("Connection not found");
  }

  // 🔥 STEP 2: Check connection accepted
  if (connection.status !== "accepted") {
    throw new Error("Connection not accepted");
  }

  // 🔥 STEP 3: Handle existing orders (Idempotency)
  const existingOrderModel = await OrderModel.findOne({
    connectionId: new Types.ObjectId(connectionId),
    gigId: new Types.ObjectId(gigId),
    status: { $in: ["PENDING", "IN_ESCROW"] }
  });

  if (existingOrderModel) {
    // If it's just PENDING, return it so the user can continue to payment
    if (existingOrderModel.status === "PENDING") {
        return {
          orderId: existingOrderModel._id,
          amount: existingOrderModel.amount,
          alreadyExisted: true
        };
    }
    // If it's already in ESCROW, then we block (already paid)
    throw new Error("You have already paid for this gig.");
  }

  // 🔥 STEP 4: Fetch price from Gig (Security)
  let orderAmount = amount;
  if (!orderAmount) {
    const gig = await GigModel.findById(new Types.ObjectId(gigId));
    if (!gig) throw new Error("Gig not found");
    orderAmount = gig.pricing.basePrice;
  }

  // 🔥 STEP 5: Create order
  const order = await OrderModel.create({
    gigId: new Types.ObjectId(gigId),
    buyerId: new Types.ObjectId(buyerId),
    influencerId: new Types.ObjectId(influencerId),
    amount: orderAmount,
    connectionId: new Types.ObjectId(connectionId),

    status: "PENDING",
    escrowStatus: "HOLD",
    workStatus: "NOT_STARTED",
  });

  return {
    orderId: order._id,
    amount: order.amount,
  };
};

// ================= SUBMIT WORK =================
export const submitWorkService = async (orderId: string) => {
  const order = await OrderModel.findById(new Types.ObjectId(orderId));

  if (!order) {
    throw new Error("OrderModel not found");
  }

  if (order.status !== "IN_ESCROW") {
    throw new Error("Payment not completed");
  }

  order.workStatus = "SUBMITTED";
  await order.save();

  return order;
};

// ================= APPROVE WORK =================
export const approveWorkService = async (orderId: string) => {
  const order = await OrderModel.findById(new Types.ObjectId(orderId));

  if (!order) {
    throw new Error("OrderModel not found");
  }

  if (order.workStatus !== "SUBMITTED") {
    throw new Error("Work not submitted");
  }

  order.workStatus = "APPROVED";
  order.status = "COMPLETED";
  order.escrowStatus = "RELEASED";

  await order.save();

  return order;
};