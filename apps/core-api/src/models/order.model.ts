import mongoose from "mongoose";
import { model } from "mongoose";
import type { OrderDocument } from "src/types/order.types.js";

const orderSchema = new mongoose.Schema(
  {
    buyerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    influencerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    gigId: { type: mongoose.Schema.Types.ObjectId, required: true },

    // 🔥 ADD THIS
    connectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Connection",
      required: true,
    },

    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    status: {
      type: String,
      enum: ["PENDING", "IN_ESCROW", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },

    escrowStatus: {
      type: String,
      enum: ["HOLD", "RELEASED"],
      default: "HOLD",
    },

    workStatus: {
      type: String,
      enum: ["NOT_STARTED", "SUBMITTED", "APPROVED"],
      default: "NOT_STARTED",
    },

    stripePaymentIntentId: String,
  },
  { timestamps: true }
);

export const OrderModel = model<OrderDocument>("Order", orderSchema);
