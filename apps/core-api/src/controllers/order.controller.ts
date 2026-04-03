import type { Request, Response } from "express";

import { createOrderService } from "../services/order.service.js";
import Order from "../models/order.model.js";

// ✅ CREATE ORDER (already exists)
export const createOrder = async (req: Request, res: Response) => {
  const result = await createOrderService(req.body);
  res.json(result);
};

// 🔥 NEW: RELEASE PAYMENT
export const releasePayment = async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.escrowStatus !== "HOLD") {
    return res.status(400).json({ message: "Payment not in escrow" });
  }

  // 🔥 RELEASE MONEY
  order.status = "COMPLETED";
  order.escrowStatus = "RELEASED";

  await order.save();

  res.json({
    message: "Payment released to influencer ✅",
  });
};




///  ================= MARK WORK AS SUBMITTED (INFLUENCER) =================



export const markCompleted = async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.workStatus = "SUBMITTED";

  await order.save();

  res.json({ message: "Work submitted ✅" });
};


// ================= APPROVE WORK & RELEASE PAYMENT (BRAND) =================

export const approveWork = async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.workStatus !== "SUBMITTED") {
    return res.status(400).json({ message: "Work not submitted yet" });
  }

  order.workStatus = "APPROVED";
  order.status = "COMPLETED";
  order.escrowStatus = "RELEASED";

  await order.save();

  res.json({ message: "Work approved & payment released ✅" });
};