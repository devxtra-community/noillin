import { Schema, model } from "mongoose";

import type { GigDocument } from "../types/gig.type.js";


const GigSchema = new Schema<GigDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    influencerIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "InfluencerProfile",
        required: true
      }
    ],

    primaryInfluencerId: {
      type: Schema.Types.ObjectId,
      ref: "InfluencerProfile",
      required: true,
      index: true
    },

    category: {
      type: String,
      required: true,
      index: true
    },

    tags: [
      {
        type: String,
        index: true
      }
    ],

    pricing: {
      basePrice: {
        type: Number,
        required: true
      },
      currency: {
        type: String,
        enum: ["INR", "USD"],
        required: true
      },
      negotiationAllowed: {
        type: Boolean,
        default: false
      }
    },

    deliverables: [
      {
        type: String
      }
    ],

    maxBookingsPerSlot: {
      type: Number
    },

    status: {
      type: String,
      enum: ["draft", "published", "paused", "archived"],
      default: "draft",
      index: true
    },

    searchMeta: {
      searchableText: {
        type: String
      }
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

GigSchema.index({ influencerIds: 1 });
GigSchema.index({ "pricing.basePrice": 1 });

export const GigModel = model<GigDocument>("Gig", GigSchema);
