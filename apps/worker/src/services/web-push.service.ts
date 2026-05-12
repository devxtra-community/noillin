import webPush from "web-push";
import type { PushSubscription } from "web-push";

import { logger } from "../utils/logger.js";

const publicVapidKey = process.env.VAPID_PUBLIC_KEY || "";
const privateVapidKey = process.env.VAPID_PRIVATE_KEY || "";

if (publicVapidKey && privateVapidKey) {
  webPush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:test@example.com",
    publicVapidKey,
    privateVapidKey
  );
} else {
  logger.warn("VAPID keys not configured for Web Push");
}

export class WebPushService {
  async sendNotification(subscription: PushSubscription, payload: unknown) {
    try {
      await webPush.sendNotification(
        subscription,
        JSON.stringify(payload)
      );
      return true;
    } catch (error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error
  ) {
    const err = error as { statusCode?: number };

    if (err.statusCode === 410 || err.statusCode === 404) {
      logger.warn("Push subscription expired or invalid", { subscription });
      return false;
    }
  }

  logger.error("Error sending push notification", error);
  throw error;
}
  }
}

export const webPushService = new WebPushService();
