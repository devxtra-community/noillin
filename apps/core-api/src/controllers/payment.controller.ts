import type { Request, Response, NextFunction } from "express";
import type Stripe from "stripe";

import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { InfluencerProfile } from "../models/influencer.model.js";
import { stripe } from "../lib/stripe.js";
import { OrderModel } from "../models/order.model.js";
import { createBooking } from "../services/booking.service.js";
import { createCheckoutSession } from "../services/payment.service.js";
import { publishEvent } from "../queue/publisher.js";


export const createCheckout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.body;
    let { amount } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required." });
    }

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: `Order not found with ID: ${orderId}` });
    }

    if (!amount) {
      amount = order.amount;
    }

    const influencerProfile = await InfluencerProfile.findOne({ userId: order.influencerId });
    if (!influencerProfile?.stripeAccountId) {
      return res.status(400).json({
        message: "Influencer has not set up a Stripe account for payouts. Please ask them to connect Stripe in their Earning's dashboard."
      });
    }

    const session = await createCheckoutSession(amount, orderId, influencerProfile.stripeAccountId);

    res.json({ url: session.url });
  } catch (err: unknown) {
    const error = err as Error & { statusCode?: number };
    console.error("Checkout Error:", error);
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

    // 🔥 REAL-TIME NOTIFICATION
    await publishEvent("payment.confirmed", {
      orderId: order._id.toString(),
      influencerId: order.influencerId.toString(),
      amount: order.amount,
    });

    // ✅ CREATE BOOKING
    await createBooking(order);
  }

  res.json({ received: true });
};

// 🔥 STRIPE CONNECT ONBOARDING
export const createStripeAccountLink = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const profile = await InfluencerProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    let stripeAccountId = profile.stripeAccountId;

    // 🔥 AUTO-HEAL: If account ID exists, verify it still exists in this Stripe environment
    if (stripeAccountId) {
      try {
        await stripe.accounts.retrieve(stripeAccountId);
      } catch (err: unknown) {
        const error = err as Error;
        console.warn(`Old Stripe account ${stripeAccountId} is invalid. Resetting...: ${error.message}`);
        stripeAccountId = ""; // Mark as empty to trigger new creation below
      }
    }

    // If no account exists (or was just reset), create a new Express account
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });
      stripeAccountId = account.id;
      profile.stripeAccountId = stripeAccountId;
      await profile.save();
    }

    // Create the onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/influencer-dashboard/earnings?error=stripe_refresh`,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/influencer-dashboard/earnings?status=verified`,
      type: "account_onboarding",
    });

    res.json({ url: accountLink.url });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Stripe Connect Error:", error);
    res.status(500).json({ message: error.message || "Failed to create Stripe link" });
  }
};