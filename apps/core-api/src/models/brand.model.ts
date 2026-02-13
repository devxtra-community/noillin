import { Schema, model, Types, Document } from "mongoose";

export interface IBrandProfile extends Document {
  userId: Types.ObjectId;

  companyName: string;
  industry: string;
  website?: string;

  contactPersonName: string;
  contactEmail: string;
  contactPhone?: string;

  businessRegistrationNumber?: string;
  gstNumber?: string;
  companySize?: string;

  documents: string[]; // S3 keys

  isProfileComplete: boolean;
  isVerified: boolean;
}

const BrandProfileSchema = new Schema<IBrandProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    industry: {
      type: String,
      required: true,
    },

    website: String,

    contactPersonName: {
      type: String,
      required: true,
    },

    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
    },

    contactPhone: String,

    businessRegistrationNumber: String,
    gstNumber: String,
    companySize: String,

    documents: {
      type: [String], // store S3 keys
      default: [],
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const BrandProfile = model<IBrandProfile>(
  "BrandProfile",
  BrandProfileSchema
);