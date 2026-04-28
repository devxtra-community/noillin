import type { Request, Response, NextFunction } from "express";
import type Stripe from "stripe";

import { InfluencerProfile } from "../models/influencer.model.js";
import { stripe } from "../lib/stripe.js";
import { OrderModel } from "../models/order.model.js";
import { createBooking } from "../services/booking.service.js";
import { createCheckoutSession } from "../services/payment.service.js";


export const createCheckout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.body;
    let { amount } = req.body;


    if (!amount) {
      // Find order to get default amount if missing
      const order = await OrderModel.findById(orderId);
      if (!order) throw new Error("Order not found");
      amount = order.amount;
    }

    // 🔥 Fetch Influencer's Stripe ID
    const order = await OrderModel.findById(orderId);
    if (!order) throw new Error("Order not found");

    const influencerProfile = await InfluencerProfile.findOne({ userId: order.influencerId });
    if (!influencerProfile?.stripeAccountId) {
      throw new Error("Influencer has not set up a Stripe account for payouts.");
    }

    const session = await createCheckoutSession(amount, orderId, influencerProfile.stripeAccountId);

    res.json({ url: session.url });
    console.log("SESSION URL:", session.url);
  } catch (err: unknown) {
    const error = err as Error & { statusCode?: number };
    if (error.statusCode === 401) {
      // Prevent Stripe 401 errors from triggering frontend auth refresh loops
      error.statusCode = 500;
      error.message = "Stripe Authentication failed: Invalid Secret Key provided in backend.";
    }
    next(error);
  }
};


// 🔥 STRIPE WEBHOOK (ESCROW LOGIC)
export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook Error:", err);
    return res.status(400).send("Webhook Error");
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    const order = await OrderModel.findById(orderId);
    if (!order) return res.json({ status: "order not found" });

    // ✅ IDEMPOTENCY
    if (order.status === "IN_ESCROW") {
      return res.json({ status: "already processed" });
    }

    // 🔥 ESCROW STARTS HERE (10% Fee)
    const PLATFORM_FEE_PERCENTAGE = 0.10;
    const amount = order.amount;
    const platformFee = amount * PLATFORM_FEE_PERCENTAGE;
    const influencerAmount = amount - platformFee;

    order.status = "IN_ESCROW";
    order.escrowStatus = "HOLD";
    order.stripePaymentIntentId = session.payment_intent as string;
    order.platformFee = platformFee;
    order.influencerAmount = influencerAmount;

    await order.save();

    console.log(`✅ Order ${orderId} is now IN_ESCROW. Fee: ${platformFee}, Influencer: ${influencerAmount}`);

    // ✅ CREATE BOOKING
    await createBooking(order);
  }

  res.json({ received: true });
};