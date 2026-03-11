import { Schema, model, Types, Document } from "mongoose";

export interface IInfluencerProfile extends Document {
  userId: Types.ObjectId;

  fullName: string;
  username: string;
  bio?: string;

  instagramUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;

  categories: string[];
  location?: string;
  languages: string[];

  followersCount?: number;
  engagementRate?: number;

  isProfileComplete: boolean;
  isVerified: boolean;
  profileImageUrl?: string,
}

const InfluencerProfileSchema = new Schema<IInfluencerProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    fullName: {
      type: String,
      default: "",
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    bio: {
      type: String,
      maxlength: 500,
    },
    profileImageUrl: {
      type: String,
      default: ""
    },

    instagramUrl: String,
    youtubeUrl: String,
    tiktokUrl: String,

    categories: {
      type: [String],
      default: [],
    },

    location: String,

    languages: {
      type: [String],
      default: [],
    },

    followersCount: Number,
    engagementRate: Number,

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

export const InfluencerProfile = model<IInfluencerProfile>(
  "InfluencerProfile",
  InfluencerProfileSchema
);