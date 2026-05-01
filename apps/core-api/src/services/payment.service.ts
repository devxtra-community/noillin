import { stripe } from "../lib/stripe.js";

export const createCheckoutSession = async (
  amount: number,
  influencerStripeAccountId: string,
  metadata: Record<string, string | number | undefined>
) => {
  // If no Stripe API key is configured, return a mock redirect URL
  if (!process.env.STRIPE_SECRET_KEY) {
    return { url: "https://buy.stripe.com/test_mock" };
  }

  const PLATFORM_FEE_PERCENTAGE = 0.10; // 10%
  const platformFeeAmount = Math.round(amount * PLATFORM_FEE_PERCENTAGE * 100); // In cents

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionConfig: any = {
    payment_method_types: ["card"],
    mode: "payment",

    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "Influencer Booking",
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],

    success_url: `http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: "http://localhost:3000/payment/cancel",
    metadata,
  };

  // Skip Stripe Connect destination split if mock payout is enabled!
  if (process.env.STRIPE_MOCK_PAYOUT !== "true" && influencerStripeAccountId) {
    sessionConfig.payment_intent_data = {
      application_fee_amount: platformFeeAmount,
      transfer_data: {
        destination: influencerStripeAccountId,
      },
    };
  }

  const session = await stripe.checkout.sessions.create(sessionConfig);
  return session;
};