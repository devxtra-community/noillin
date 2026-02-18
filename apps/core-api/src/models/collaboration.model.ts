import { Schema, model } from "mongoose";

import type { GigCollaborationDocument } from "../types/collaboration.type.js";


const GigCollaborationSchema =
  new Schema<GigCollaborationDocument>(
    {
      gigId: {
        type: Schema.Types.ObjectId,
        ref: "Gig",
        required: true,
        index: true
      },

      primaryInfluencerId: {
        type: Schema.Types.ObjectId,
        ref: "InfluencerProfile",
        required: true,
        index: true
      },

      invitedInfluencerId: {
        type: Schema.Types.ObjectId,
        ref: "InfluencerProfile",
        required: true,
        index: true
      },

      status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "cancelled"],
        default: "pending",
        index: true
      },

      respondedAt: {
        type: Date
      }
    },
    { timestamps: true }
  );

// Prevent duplicate invitations
GigCollaborationSchema.index(
  { gigId: 1, invitedInfluencerId: 1 },
  { unique: true }
);

export const GigCollaborationModel = model<GigCollaborationDocument>(
  "GigCollaboration",
  GigCollaborationSchema
);
