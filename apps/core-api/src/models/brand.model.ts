import { Schema, model, Types, Document } from "mongoose";

export interface IBrandProfile extends Document {
  userId: Types.ObjectId;

  companyName: string;
  slug?: string;
  industry: string;
  website?: string;

  contactPersonName: string;
  contactEmail: string;
  contactPhone?: string;

  businessRegistrationNumber?: string;
  gstNumber?: string;
  companySize?: string;

  description?: string;
  headquarters?: string;

  documents: string[];

  profileImageUrl?: string;

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
      index: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    industry: {
      type: String,
      required: true,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
    },

    contactPersonName: {
      type: String,
      required: true,
      trim: true,
    },

    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    contactPhone: String,

    businessRegistrationNumber: String,
    gstNumber: String,

    companySize: {
      type: String,
      trim: true,
    },

    description: String,
    headquarters: String,

    documents: {
      type: [String],
      default: [],
    },

    profileImageUrl: {
      type: String,
      default: "",
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