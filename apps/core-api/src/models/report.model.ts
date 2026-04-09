import { Schema, model } from "mongoose";

import type { ReportDocument } from "../types/report.types.js";

const ReportSchema = new Schema<ReportDocument>({
  reportId: {
    type: String,
    unique: true
  },

  entityType: {
    type: String,
    enum: ["GIG", "ORDER", "USER"],
    required: true
  },

  entityId: {
    type: Schema.Types.ObjectId,
    required: true
  },

  type: {
    type: String,
    enum: ["CONTENT", "PAYMENT", "BEHAVIOR"],
    required: true,
    validate: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validator: function (this: any, value: string) {
        if (this.entityType === "ORDER") {
          return value === "PAYMENT";
        }
        return true;
      },
      message: "ORDER reports must be of type PAYMENT"
    }
  },

  subType: {
    type: String,
    enum: ["NOT_RECEIVED", "LOW_QUALITY", "SCAM", "PAYMENT_ISSUE"],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    required: function (this: any) {
      return this.type === "PAYMENT";
    }
  },

  reportedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  usersInvolved: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],

  description: String,

  status: {
    type: String,
    enum: ["PENDING", "UNDER_REVIEW", "RESOLVED"],
    default: "PENDING"
  },

  resolution: {
    type: String,
    enum: ["VALID", "INVALID"],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    required: function (this: any) {
      return this.status === "RESOLVED";
    }
  },

  adminNotes: String,

  auditTrail: [
    {
      action: String,
      performedBy: Schema.Types.ObjectId,
      createdAt: { type: Date, default: Date.now }
    }
  ]

}, { timestamps: true });

export const ReportModel = model<ReportDocument>("Report", ReportSchema);