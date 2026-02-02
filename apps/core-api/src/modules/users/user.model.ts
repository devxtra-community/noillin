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
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    adminLevel: {
      type: String,
      enum: Object.values(AdminLevel),
      default: AdminLevel.NORMAL,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);
