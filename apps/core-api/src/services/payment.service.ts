import { stripe } from "../lib/stripe.js";

export const createCheckoutSession = async (
  amount: number,
  orderId: string
) => {
  // If no Stripe API key is configured, return a mock redirect URL
  if (!process.env.STRIPE_SECRET_KEY) {
    return { url: "https://buy.stripe.com/test_mock" };
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",

    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "Influencer Booking",
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],

    success_url: `http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,

    cancel_url: "http://localhost:3000/payment/cancel",

    metadata: {
      orderId,
    },
  });

  return session;
};