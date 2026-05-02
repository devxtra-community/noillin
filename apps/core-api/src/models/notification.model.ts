import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["gig_request", "system", "GIG_REQUEST", "NEW_MESSAGE", "ORDER_CREATED", "USER_PENDING_APPROVAL", "USER_APPROVED"], // Extensible for later
      default: "system",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for efficient fetching of user notifications
notificationSchema.index({ userId: 1, createdAt: -1 });

export const NotificationModel = model("Notification", notificationSchema);
