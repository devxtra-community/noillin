import type { Request, Response, NextFunction } from "express";
import type Stripe from "stripe";

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

    const session = await createCheckoutSession(amount, orderId);

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

    order.status = "COMPLETED";

    // ✅ CREATE BOOKING
    await createBooking(order);
  }

  res.json({ received: true });
};