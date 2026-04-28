import type { Response } from "express";

import { stripe } from "../lib/stripe.js";
import { OrderModel } from "../models/order.model.js";
import { InfluencerProfile } from "../models/influencer.model.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

/**
 * 🔥 MANUAL WITHDRAWAL (FULL BALANCE MVP)
 * Influencer withdraws ALL eligible "AVAILABLE" funds at once.
 */
export const withdrawBalance = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        // 1. Fetch Influencer Profile for Stripe ID
        const profile = await InfluencerProfile.findOne({ userId });
        if (!profile?.stripeAccountId) {
            return res.status(400).json({ message: "No connected Stripe account found." });
        }

        // 2. Fetch all COMPLETED orders with AVAILABLE payoutStatus
        const eligibleOrders = await OrderModel.find({
            influencerId: userId,
            status: "COMPLETED",
            payoutStatus: "AVAILABLE",
        });

        if (eligibleOrders.length === 0) {
            return res.status(400).json({ message: "No funds available for withdrawal." });
        }

        // 3. Calculate total amount to pay out
        const totalAmount = eligibleOrders.reduce((sum, order) => sum + (order.influencerAmount || 0), 0);

        if (totalAmount <= 0) {
            return res.status(400).json({ message: "Available balance is zero." });
        }

        // 4. LOCK ORDERS (Idempotency)
        const orderIds = eligibleOrders.map(o => o._id);
        await OrderModel.updateMany(
            { _id: { $in: orderIds } },
            { payoutStatus: "PROCESSING" }
        );

        const isMockMode = process.env.STRIPE_MOCK_PAYOUT === "true" || profile.stripeAccountId === "acct_test_123";

        try {
            let payoutId = "po_mock_success_123";

            // 5. TRIGGER STRIPE PAYOUT (Bypass if mock mode)
            if (isMockMode) {
                console.log("🛠️ MOCK MODE: Bypassing real Stripe payout");
            } else {
                // Note: Stripe Payouts use the smallest currency unit (cents/paise)
                const payout = await stripe.payouts.create(
                    {
                        amount: Math.round(totalAmount * 100),
                        currency: "inr",
                    },
                    {
                        stripeAccount: profile.stripeAccountId,
                    }
                );
                payoutId = payout.id;
            }

            // 6. UPDATE ORDERS ON SUCCESS
            await OrderModel.updateMany(
                { _id: { $in: orderIds } },
                {
                    payoutStatus: "PAID",
                    stripePayoutId: payoutId
                }
            );

            res.json({
                message: "Withdrawal successful! (MOCK MODE enabled for acct_test_123)",
                payoutId: payoutId,
                amount: totalAmount,
            });

        } catch (stripeError: unknown) {
            const error = stripeError as Error;
            console.error("Stripe Payout Error:", error);

            // 🚨 REVERT ON FAILURE
            await OrderModel.updateMany(
                { _id: { $in: orderIds } },
                { payoutStatus: "AVAILABLE" }
            );

            res.status(500).json({
                message: "Stripe payout failed. Please try again later.",
                error: error.message
            });
        }

    } catch (error: unknown) {
        console.error("Withdrawal Error:", error);
        res.status(500).json({ message: "An error occurred during withdrawal." });
    }
};
