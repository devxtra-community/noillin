import type { Response } from "express";
import { Types } from "mongoose";

import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { createOrderService } from "../services/order.service.js";
import { OrderModel } from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";
import { publishEvent } from "../queue/publisher.js";


// ✅ CREATE ORDER (already exists)
export const createOrder = async (req: AuthRequest, res: Response) => {
  const result = await createOrderService(req.body);
  res.json(result);
};


// 🔥 NEW: RELEASE PAYMENT
export const releasePayment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;


  const order = await OrderModel.findById(id);

  if (!order) {
    return res.status(404).json({ message: "OrderModel not found" });
  }

  if (order.escrowStatus !== "HOLD") {
    return res.status(400).json({ message: "Payment not in escrow" });
  }

  // 🔥 RELEASE MONEY
  order.status = "COMPLETED";
  order.escrowStatus = "RELEASED";

  await order.save();
  await publishEvent("payment.released", {
  orderId: order._id.toString(),
  influencerId: order.influencerId,
});
  res.json({
    message: "Payment released to influencer ✅",
  });
};




///  ================= MARK WORK AS SUBMITTED (INFLUENCER) =================



export const markCompleted = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;


  const order = await OrderModel.findById(id);

  if (!order) {
    return res.status(404).json({ message: "OrderModel not found" });
  }

  order.workStatus = "SUBMITTED";

  await order.save();
  await publishEvent("order.submitted", {
  orderId: order._id.toString(),
  buyerId: order.buyerId,
});

  res.json({ message: "Work submitted ✅" });
};


// ================= APPROVE WORK & RELEASE PAYMENT (BRAND) =================

export const approveWork = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;


  const order = await OrderModel.findById(id);

  if (!order) {
    return res.status(404).json({ message: "OrderModel not found" });
  }

  if (order.workStatus !== "SUBMITTED") {
    return res.status(400).json({ message: "Work not submitted yet" });
  }

  order.workStatus = "APPROVED";
  order.status = "COMPLETED";
  order.escrowStatus = "RELEASED";

  await order.save();
  await publishEvent("order.completed", {
  orderId: order._id.toString(),
  influencerId: order.influencerId,
});


  res.json({ message: "Work approved & payment released ✅" });
};

// ================= GET ORDER DETAILS =================
export const getOrderDetails = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const order = await OrderModel.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
};

// ================= GET TRANSACTION HISTORY =================
export const getHistory = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId } = req.user;


    const orders = await OrderModel.find({
        $or: [
            { buyerId: new Types.ObjectId(userId) },
            { influencerId: new Types.ObjectId(userId) }
        ]
    })
    .populate("gigId")
    .sort({ createdAt: -1 });

    res.json(orders);
};

// ================= GET ORDER BY STRIPE SESSION =================
export const getOrderBySession = async (req: AuthRequest, res: Response) => {
    const { sessionId } = req.params;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId as string);
        const orderId = session.metadata?.orderId;


        if (!orderId) {
            return res.status(404).json({ message: "Order ID not found in session metadata" });
        }

        const order = await OrderModel.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        res.json(order);
    } catch (err) {
        console.error("getOrderBySession error:", err);
        res.status(500).json({ message: "Failed to retrieve session" });
    }
};