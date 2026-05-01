import { Types } from "mongoose";

import { NotificationModel } from "../models/notification.model.js";
import { PushSubscriptionModel } from "../models/push-subscription.model.js";

export interface PushSubscriptionInput {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export class NotificationService {
  // Push Subscription Methods
  async saveSubscription(userId: string, subscription: PushSubscriptionInput) {
    // Upsert subscription based on endpoint
    const existing = await PushSubscriptionModel.findOne({
      endpoint: subscription.endpoint,
    });

    if (existing) {
      if (existing.userId.toString() !== userId) {
        // Re-assign to new user if endpoint exists but for a different user
        existing.userId = userId as unknown as Types.ObjectId;
        await existing.save();
      }
      return existing;
    }

    return await PushSubscriptionModel.create({
      userId,
      endpoint: subscription.endpoint,
      keys: subscription.keys,
    });
  }

  async getUserSubscriptions(userId: string) {
    return await PushSubscriptionModel.find({ userId });
  }

  async removeSubscription(endpoint: string) {
    return await PushSubscriptionModel.deleteOne({ endpoint });
  }

  // Notification Methods
  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: string = "system",
    metadata: Record<string, unknown> = {}
  ) {
    return await NotificationModel.create({
      userId,
      title,
      message,
      type,
      metadata,
    });
  }

  async getUserNotifications(userId: string, limit: number = 20) {
    return await NotificationModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async markAsRead(notificationId: string, userId: string) {
    return await NotificationModel.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );
  }

  async markAllAsRead(userId: string) {
    return await NotificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
  }

  async getUnreadCount(userId: string) {
    return await NotificationModel.countDocuments({ userId, isRead: false });
  }
}
