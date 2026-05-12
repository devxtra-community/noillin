import type { Response } from "express";
import { Types } from "mongoose";

import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { createOrderService, type CreateOrderInput } from "../services/order.service.js";
import { OrderModel } from "../models/order.model.js";
import { InfluencerProfile } from "../models/influencer.model.js";
import { stripe } from "../lib/stripe.js";
import { publishEvent } from "../queue/publisher.js";
import { PlatformRevenueModel } from "../models/platform-revenue.model.js";
import { MessageModel } from "../models/chat.model.js";
import { GigRequestModel } from "../models/gig-request.model.js";
import { BrandProfile } from "../models/brand.model.js";


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
  const { deliverableUrl } = req.body;

  const order = await OrderModel.findById(id);

  if (!order) {
    return res.status(404).json({ message: "OrderModel not found" });
  }

  order.workStatus = "SUBMITTED";
  order.rejectionNote = ""; // Clear previous rejection note on resubmission
  if (deliverableUrl) {
    order.deliverableUrl = deliverableUrl;
  }

  await order.save();
  await publishEvent("order.submitted", {
    orderId: order._id.toString(),
    buyerId: order.buyerId,
  });

  res.json({ message: "Work submitted ✅" });
};

// ================= REJECT WORK (BRAND) =================

export const rejectWork = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { note } = req.body;

  const order = await OrderModel.findById(id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.workStatus !== "SUBMITTED") {
    return res.status(400).json({ message: "Can only reject submitted work" });
  }

  order.workStatus = "REJECTED";
  order.rejectionNote = note;

  await order.save();

  await publishEvent("order.rejected", {
    orderId: order._id.toString(),
    influencerId: order.influencerId,
    reason: note
  });

  res.json({ message: "Work rejected with feedback ✅" });
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

  // 🔥 UNLOCK FUNDS FOR MANUAL WITHDRAWAL
  order.workStatus = "APPROVED";
  order.status = "COMPLETED";
  order.escrowStatus = "RELEASED";

  // Financial payout status
  order.payoutStatus = "AVAILABLE";
  order.availableAt = new Date();

  await order.save();

  await publishEvent("order.completed", {
    orderId: order._id.toString(),
    influencerId: order.influencerId,
  });

  res.json({
    message: "Work approved. Funds are now available for withdrawal in your dashboard. ✅",
    availableAt: order.availableAt
  });
};


// ================= CANCEL ORDER & REFUND (BRAND/ADMIN) =================
export const cancelOrder = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const order = await OrderModel.findById(id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // 🔥 RESTRICTION: Only allow refund if status is IN_ESCROW or it is completed but NOT yet requested for withdrawal
  const canRefund = (order.status === "IN_ESCROW" && order.escrowStatus === "HOLD") ||
    (order.status === "COMPLETED" && order.payoutStatus === "AVAILABLE");

  if (!canRefund) {
    return res.status(400).json({
      message: "Order cannot be refunded at this stage. (Already processing withdrawal or cancelled)"
    });
  }

  try {
    // 🔥 STRIPE REFUND
    await stripe.refunds.create({
      payment_intent: order.stripePaymentIntentId as string,
    });

    order.status = "CANCELLED";
    order.escrowStatus = "RELEASED";
    order.payoutStatus = "HOLD"; // Reset payout status

    await order.save();

    await publishEvent("order.cancelled", {
      orderId: order._id.toString(),
      buyerId: order.buyerId,
    });

    res.json({ message: "Order cancelled and refund initiated ✅" });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Stripe Refund Error:", error);
    res.status(500).json({ message: "Failed to initiate refund via Stripe." });
  }
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

  try {
    // 1. Get existing orders
    const orders = await OrderModel.find({
      $or: [
        { buyerId: new Types.ObjectId(userId) },
        { influencerId: new Types.ObjectId(userId) }
      ]
    })
      .populate("gigId")
      .sort({ createdAt: -1 })
      .lean();

    // 2. Get accepted GigRequests that DON'T have an order yet
    const existingOrderConnectionIds = orders
      .filter(o => o.connectionId)
      .map(o => o.connectionId.toString());

    const pendingRequests = await GigRequestModel.find({
      $or: [
        { brandId: new Types.ObjectId(userId) },
        { influencerId: new Types.ObjectId(userId) }
      ],
      status: "accepted",
      _id: { $nin: existingOrderConnectionIds.map(id => new Types.ObjectId(id)) }
    })
      .populate("gigId")
      .sort({ createdAt: -1 })
      .lean();

    // 3. Map GigRequests to a mock "Order" structure for the frontend
    const virtualOrders = pendingRequests.map((req: Record<string, unknown>) => ({
      _id: `virtual-${req._id as string}`,
      connectionId: req._id as string,
      gigId: req.gigId as { title: string; pricing?: { basePrice: number } },
      buyerId: req.brandId as string,
      influencerId: req.influencerId as string,
      amount: (req.gigId as { pricing?: { basePrice: number } })?.pricing?.basePrice || 0,
      status: "PENDING",
      workStatus: "NOT_STARTED",
      createdAt: req.createdAt as string,
      isVirtual: true
    }));

    // 4. Combine and populate influencer profiles
    const allEntries = [...orders, ...virtualOrders].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const influencerIds = [...new Set(allEntries.map(o => (o as { influencerId: Types.ObjectId | string }).influencerId.toString()))];
    const profiles = await InfluencerProfile.find({ userId: { $in: influencerIds } }).lean();

    const buyerIds = [...new Set(allEntries.map(o => (o as { buyerId: Types.ObjectId | string }).buyerId?.toString()).filter(id => !!id))];
    const brandProfiles = await BrandProfile.find({ userId: { $in: buyerIds } }).lean();

    const populatedEntries = allEntries.map(entry => {
      const e = entry as { influencerId: Types.ObjectId | string, buyerId?: Types.ObjectId | string, brandId?: Types.ObjectId | string };
      const profile = (profiles as unknown as { userId: { toString: () => string } }[]).find(p => p.userId.toString() === e.influencerId.toString());
      const buyerId = e.buyerId?.toString() || e.brandId?.toString();
      const bProfile = (brandProfiles as unknown as { userId: { toString: () => string } }[]).find(bp => bp.userId.toString() === buyerId);
      return { ...entry, influencerProfile: profile, brandProfile: bProfile };
    });

    console.log(`Fetched ${orders.length} orders and ${virtualOrders.length} virtual orders for user ${userId}`);
    res.json(populatedEntries);
  } catch (error) {
    console.error("Error in getHistory:", error);
    res.status(500).json({ message: "Failed to fetch booking history" });
  }
};

// ================= GET ORDER BY STRIPE SESSION =================
export const getOrderBySession = async (req: AuthRequest, res: Response) => {
  const { sessionId } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId as string);
    const { orderId: metadataOrderId, gigRequestId, gigId, buyerId, influencerId, amount: amountStr, dueDate } = session.metadata || {};

    let order = null;

    if (metadataOrderId) {
      order = await OrderModel.findById(metadataOrderId);
    } else if (gigRequestId) {
      order = await OrderModel.findOne({ connectionId: gigRequestId });
    }

    // 🔥 AUTO-HEAL: Create order if it doesn't exist but payment is successful
    if (!order && session.payment_status === "paid" && gigRequestId) {
      const amount = parseFloat(amountStr || "0");
      const orderData: CreateOrderInput = {
        gigId: gigId as string,
        buyerId: buyerId as string,
        influencerId: influencerId as string,
        connectionId: gigRequestId as string,
        amount,
      };
      if (dueDate) {
        orderData.dueDate = dueDate as string;
      }
      const result = await createOrderService(orderData);
      order = await OrderModel.findById(result.orderId);
      console.log("Auto-created Order on Success route via session retrieval");
    }

    if (!order) return res.status(404).json({ message: "Order not found" });

    // 🔥 AUTO-HEAL status: If Stripe webhook was bypassed
    if (session.payment_status === "paid" && order.status === "PENDING") {
      const platformFee = order.amount * 0.05;
      const influencerAmount = order.amount - platformFee;

      order.status = "IN_ESCROW";
      order.escrowStatus = "HOLD";
      order.stripePaymentIntentId = session.payment_intent as string;
      order.platformFee = platformFee;
      order.influencerAmount = influencerAmount;
      await order.save();

      const profile = await InfluencerProfile.findOne({ userId: order.influencerId });
      if (profile) {
        profile.balance = (profile.balance || 0) + influencerAmount;
        profile.totalEarnings = (profile.totalEarnings || 0) + influencerAmount;
        await profile.save();
      }

      let platform = await PlatformRevenueModel.findOne();
      if (!platform) platform = new PlatformRevenueModel();
      platform.totalRevenue = (platform.totalRevenue || 0) + platformFee;
      platform.availableBalance = (platform.availableBalance || 0) + platformFee;
      await platform.save();

      // 🔥 AUTOMATED SYSTEM CHAT MESSAGE (Fallback delivery)
      await MessageModel.create({
        gigRequestId: order.connectionId,
        senderId: order.buyerId,
        receiverId: order.influencerId,
        content: `₹${order.amount.toLocaleString()} has been safely secured in platform Escrow!`,
        messageType: "SYSTEM",
        status: "SENT",
      });
      console.log("Auto-healed Order Ledger & injected System Message on Success route");
    }

    res.json(order);
  } catch (err) {
    console.error("getOrderBySession error:", err);
    res.status(500).json({ message: "Failed to retrieve session" });
  }
};