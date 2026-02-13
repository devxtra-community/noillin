import { Schema, model } from "mongoose";

const PendingSignupSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["INFLUENCER", "BRAND"],
      required: true,
    },
    documents: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const PendingSignup = model(
  "PendingSignup",
  PendingSignupSchema
);
