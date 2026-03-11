import { Schema, model } from "mongoose";

const PendingSignupSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },

    passwordHash: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["INFLUENCER", "BRAND", "ADMIN"],
      required: true,
    },
    adminLevel: {
      type: String,
      enum: ["SUPER", "NORMAL"],
      default: null,
    },
    documents: { type: String },


    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    //  OTP FIELDS START HERE

    emailOtpHash: {
      type: String,
      select: false,
      default: null,

    },


    emailOtpExpiresAt: {
      type: Date,
      default: null,
    },

    otpAttempts: {
      type: Number,
      default: 0,
    },

    otpResendCount: {
      type: Number,
      default: 0,
    },

    otpLastSentAt: {
      type: Date,
      default: null,
    },

    otpLockedUntil: {
      type: Date,
      default: null,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true } // gives createdAt & updatedAt automatically
);

export const PendingSignup = model(
  "PendingSignup",
  PendingSignupSchema
);
