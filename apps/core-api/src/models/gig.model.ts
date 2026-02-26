import { Schema, model } from "mongoose";

import type { GigDocument } from "../types/gig.type.js";

const DeliverableSchema = new Schema(
  {
    contentType: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    includedItems: [
      {
        type: String
      }
    ]
  },
  { _id: false }
);

const GigSchema = new Schema<GigDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    shortDescription: {
      type: String,
      required: true,
      maxlength: 180
    },

    platform: {
      type: String,
      enum: ["instagram", "youtube", "tiktok"],
      required: true,
      index: true
    },

    gigType: {
      type: String,
      enum: ["solo", "collaboration"],
      required: true,
      index: true
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

    deliverables: {
      type: [DeliverableSchema],
      default: []
    },

    pricing: {
      basePrice: {
        type: Number,
        required: true,
        min: 0
      },
      currency: {
        type: String,
        enum: ["INR", "USD"],
        required: true
      },
      negotiationAllowed: {
        type: Boolean,
        default: false
      },
      deliveryTimeInDays: {
        type: Number,
        required: true,
        min: 1
      },
      revisionsIncluded: {
        type: Number,
        required: true,
        min: 0
      }
    },

    maxBookingsPerSlot: {
      type: Number,
      min: 1
    },

    status: {
      type: String,
      enum: ["draft", "published", "paused", "archived"],
      default: "draft",
      index: true
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