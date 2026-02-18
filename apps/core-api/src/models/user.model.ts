import { Schema, model, Document } from "mongoose";

export enum UserRole {
  INFLUENCER = "INFLUENCER",
  BRAND = "BRAND",
  ADMIN = "ADMIN",
}

export enum AdminLevel {
  SUPER = "SUPER",
  NORMAL = "NORMAL",
}

export enum UserStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}

export interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;
  adminLevel?: AdminLevel;
  isEmailVerified: boolean;
  status: UserStatus;
  refreshToken?: string;

  //  Forgot Password Fields
  resetOtp?: string;
  resetOtpExpiry?: Date;
  resetSessionToken?: string;
  resetSessionExpiry?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      immutable: true,
    },

    password: {
      type: String,
      required: true,
      select: false, //  never return password
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },

    adminLevel: {
      type: String,
      enum: Object.values(AdminLevel),
      default: null,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.PENDING,
    },

    refreshToken: {
      type: String,
      select: false,
    },

    // ================================
    //  FORGOT PASSWORD FIELDS
    // ================================

    resetOtp: {
      type: String,
      select: false, // never return OTP
    },

    resetOtpExpiry: {
      type: Date,
    },

    resetSessionToken: {
      type: String,
      select: false, // never expose session token
    },

    resetSessionExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

// compound index (already yours)
UserSchema.index({ role: 1, status: 1 });

export const User = model<IUser>("User", UserSchema);
