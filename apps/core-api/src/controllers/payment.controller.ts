import type { Request, Response, NextFunction } from "express";
import type Stripe from "stripe";

import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { InfluencerProfile } from "../models/influencer.model.js";
import { stripe } from "../lib/stripe.js";
import { OrderModel } from "../models/order.model.js";
import { createCheckoutSession } from "../services/payment.service.js";
import { publishEvent } from "../queue/publisher.js";
import { PlatformRevenueModel } from "../models/platform-revenue.model.js";
import { MessageModel } from "../models/chat.model.js";
import { GigRequestModel } from "../models/gig-request.model.js";
import { GigModel } from "../models/gig.model.js";
import { createOrderService } from "../services/order.service.js";
import type { CreateOrderInput } from "../services/order.service.js";


export const createCheckout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { gigRequestId } = req.body;
    let { amount } = req.body;

    if (!gigRequestId) {
      return res.status(400).json({ message: "Gig Request ID is required." });
    }

    const gigRequest = await GigRequestModel.findById(gigRequestId).populate("gigId");
    if (!gigRequest) {
      return res.status(404).json({ message: `Gig Request not found with ID: ${gigRequestId}` });
    }

    if (gigRequest.status !== "accepted") {
      return res.status(400).json({ message: "Gig Request must be accepted before payment." });
    }

    const gig = await GigModel.findById(gigRequest.gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig information not found." });
    }

    // Amount can be overridden by frontend (negotiated price), otherwise use base price
    if (!amount) {
      amount = gig.pricing.basePrice;
    }

    const influencerProfile = await InfluencerProfile.findOne({ userId: gigRequest.influencerId });
    if (!influencerProfile?.stripeAccountId && process.env.STRIPE_MOCK_PAYOUT !== "true") {
      return res.status(400).json({
        message: "Influencer has not set up a Stripe account for payouts. Please ask them to connect Stripe in their Earning's dashboard."
      });
    }

    // Metadata for post-payment order creation
    const metadata = {
      gigRequestId: gigRequest._id.toString(),
      gigId: gig._id.toString(),
      buyerId: gigRequest.brandId.toString(),
      influencerId: gigRequest.influencerId.toString(),
      amount: amount.toString(),
      // Optional: due date from latest accepted proposal
      dueDate: req.body.dueDate || "",
    };

    const session = await createCheckoutSession(amount, influencerProfile?.stripeAccountId || "mock_account", metadata);

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

    // Extract metadata
    const { gigRequestId, gigId, buyerId, influencerId, amount: amountStr, dueDate } = session.metadata || {};

    if (!gigRequestId || !gigId || !buyerId || !influencerId) {
      console.error("Missing metadata in Stripe session:", session.id);
      return res.json({ status: "metadata missing" });
    }

    // ✅ IDEMPOTENCY: Check if order already exists for this gigRequest
    let order = await OrderModel.findOne({ connectionId: gigRequestId });

    if (order && order.status === "IN_ESCROW") {
      return res.json({ status: "already processed" });
    }

    const amount = parseFloat(amountStr || "0");

    // 🔥 CREATE ORDER RECORD POST-PAYMENT
    if (!order) {
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
    }

    if (!order) {
      console.error("Failed to create order in webhook for session:", session.id);
      return res.status(500).json({ message: "Order creation failed" });
    }

    const orderId = order._id;

    // 🔥 ESCROW STARTS HERE (10% Fee)
    const PLATFORM_FEE_PERCENTAGE = 0.10;
    const platformFee = amount * PLATFORM_FEE_PERCENTAGE;
    const influencerAmount = amount - platformFee;

    order.status = "IN_ESCROW";
    order.escrowStatus = "HOLD";
    order.stripePaymentIntentId = session.payment_intent as string;
    order.platformFee = platformFee;
    order.influencerAmount = influencerAmount;

    await order.save();

    // 🔥 VIRTUAL BALANCE UPDATES
    const profile = await InfluencerProfile.findOne({ userId: order.influencerId });
    if (profile) {
      profile.balance = (profile.balance || 0) + influencerAmount;
      profile.totalEarnings = (profile.totalEarnings || 0) + influencerAmount;
      await profile.save();
    }

    let platform = await PlatformRevenueModel.findOne();
    if (!platform) {
      platform = new PlatformRevenueModel();
    }
    platform.totalRevenue = (platform.totalRevenue || 0) + platformFee;
    platform.availableBalance = (platform.availableBalance || 0) + platformFee;
    await platform.save();

    console.log(`✅ Order ${orderId} IN_ESCROW. Fee added: ${platformFee}, Influencer cut: ${influencerAmount}`);

    // 🔥 REAL-TIME NOTIFICATION
    await publishEvent("payment.confirmed", {
      orderId: order._id.toString(),
      influencerId: order.influencerId.toString(),
      amount: order.amount,
    });

    // 🔥 AUTOMATED SYSTEM CHAT MESSAGE
    await MessageModel.create({
      gigRequestId: order.connectionId,
      senderId: order.buyerId,
      receiverId: order.influencerId,
      content: `₹${order.amount.toLocaleString()} has been safely secured in platform Escrow!`,
      messageType: "SYSTEM",
      status: "SENT",
    });
  }

  res.json({ received: true });
};

// 🔥 STRIPE CONNECT ONBOARDING
export const createStripeAccountLink = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
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