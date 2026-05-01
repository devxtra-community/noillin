import type { Response } from "express";

import { NotificationService } from "../services/notification.service.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

const service = new NotificationService();

export class NotificationController {
  async saveSubscription(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.userId;
    const { subscription } = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ success: false, message: "Invalid subscription" });
    }

    try {
      const data = await service.saveSubscription(userId, subscription);
      res.status(201).json({ success: true, message: "Subscription saved", data });
    } catch (error: unknown) {
  console.error("[NotificationController.saveSubscription]", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
  }

  async removeSubscription(req: AuthRequest, res: Response) {
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({ success: false, message: "Endpoint required" });
    }

    try {
      await service.removeSubscription(endpoint);
      res.json({ success: true, message: "Subscription removed" });
    } catch (error: unknown) {
  console.error("[NotificationController.removeSubscription]", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
  }

  async getMyNotifications(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.userId;
    const limit = parseInt(req.query.limit as string) || 20;

    try {
      const notifications = await service.getUserNotifications(userId, limit);
      const unreadCount = await service.getUnreadCount(userId);

      res.json({
        success: true,
        data: {
          notifications,
          unreadCount,
        },
      });
    } catch (error: unknown) {
  console.error("[NotificationController.getMyNotifications]", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
  }

  async markAsRead(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.userId;
    const notificationId = req.params.id as string;


    try {
      const updated = await service.markAsRead(notificationId, userId);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Notification not found" });
      }
      res.json({ success: true, message: "Marked as read", data: updated });
    } catch (error: unknown) {
  console.error("[NotificationController.markAsRead]", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
  }

  async markAllAsRead(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.userId;

    try {
      await service.markAllAsRead(userId);
      res.json({ success: true, message: "All marked as read" });
    } catch (error: unknown) {
      console.error("[NotificationController.markAllAsRead]", error);

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
