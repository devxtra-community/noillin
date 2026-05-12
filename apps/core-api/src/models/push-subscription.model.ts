import { Schema, model } from "mongoose";

const pushSubscriptionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
      unique: true,
    },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },
  },
  { timestamps: true }
);

// Index for looking up subscriptions by user
pushSubscriptionSchema.index({ userId: 1 });

export const PushSubscriptionModel = model(
  "PushSubscription",
  pushSubscriptionSchema
);
