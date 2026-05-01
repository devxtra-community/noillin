import mongoose from "mongoose";
import { model } from "mongoose";

import type { OrderDocument } from "../types/order.types.js";

const orderSchema = new mongoose.Schema(
  {
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    influencerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    gigId: { type: mongoose.Schema.Types.ObjectId, ref: "Gig", required: true },

    // 🔥 ADD THIS
    connectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Connection",
      required: true,
    },
    dueDate: Date, // 🔥 AGREED DELIVERY DATE

    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    status: {
      type: String,
      enum: ["PENDING", "IN_ESCROW", "COMPLETED", "CANCELLED", "DISPUTED"],
      default: "PENDING",
    },

    escrowStatus: {
      type: String,
      enum: ["HOLD", "RELEASED"],
      default: "HOLD",
    },

    workStatus: {
      type: String,
      enum: ["NOT_STARTED", "SUBMITTED", "APPROVED", "REJECTED"],
      default: "NOT_STARTED",
    },
    deliverableUrl: String,
    rejectionNote: String,

    stripePaymentIntentId: String,
    platformFee: Number, // 10% fee
    influencerAmount: Number, // 90% share

    payoutStatus: {
      type: String,
      enum: ["HOLD", "AVAILABLE", "PROCESSING", "PAID"],
      default: "HOLD",
    },
    availableAt: Date,
    stripePayoutId: String,
  },
  { timestamps: true }
);

export const OrderModel = model<OrderDocument>("Order", orderSchema);
