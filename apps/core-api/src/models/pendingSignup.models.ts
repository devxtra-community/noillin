import { Schema, model, Document } from "mongoose";

export enum PendingSignupStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum PendingSignupRole {
  INFLUENCER = "INFLUENCER",
  BRAND = "BRAND",
}

export interface IPendingSignup extends Document {
  email: string;
  passwordHash: string;
  role: PendingSignupRole;
  documents?: string;
  status: PendingSignupStatus;

  // OTP fields
  emailOtpHash?: string | null;
  emailOtpExpiresAt?: Date | null;
  otpAttempts: number;
  otpResendCount: number;
  otpLastSentAt?: Date | null;
  otpLockedUntil?: Date | null;
  isEmailVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const PendingSignupSchema = new Schema<IPendingSignup>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(PendingSignupRole),
      required: true,
    },

    documents: {
      type: String,
    },

    status: {
      type: String,
      enum: Object.values(PendingSignupStatus),
      default: PendingSignupStatus.PENDING,
    },

    // OTP fields
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
  { timestamps: true }
);

export const PendingSignup = model<IPendingSignup>(
  "PendingSignup",
  PendingSignupSchema
);