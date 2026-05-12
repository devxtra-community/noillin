import { Schema, model } from "mongoose";


const connectionSchema = new Schema(
  {
    brandId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    influencerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    gigId: {
      type: Schema.Types.ObjectId,
      ref: "Gig",
    },

    note: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Prevent duplicate requests
connectionSchema.index(
  { brandId: 1, influencerId: 1, gigId: 1 },
  { unique: true }
);

export const ConnectionModel = model(
  "Connection",
  connectionSchema
);