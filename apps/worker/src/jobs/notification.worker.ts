import { Worker } from "bullmq";

import { logger } from "../utils/logger.js";
import { webPushService } from "../services/web-push.service.js";
import { NotificationModel } from "../../../core-api/src/models/notification.model.js";
import { PushSubscriptionModel } from "../../../core-api/src/models/push-subscription.model.js";
import { User } from "../../../core-api/src/models/user.model.js";

async function emitRealtimeNotification(userId: string, payload: unknown) {
  try {
    const url = process.env.REALTIME_URL || "http://localhost:6001";
    await fetch(`${url}/internal/emit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": process.env.INTERNAL_SECRET || ""
      },
      body: JSON.stringify({
        event: "notification:new",
        room: `user:${userId}`,
        payload
      })
    });
  } catch (err) {
    logger.error("Failed to emit realtime notification", err);
  }
}

console.log("🚀 Notification Worker started");

export const notificationWorker = new Worker(
  "notification-queue",
  async (job) => {
    console.log("🔥 JOB RECEIVED:", job.name);
    console.log("📦 JOB DATA:", job.data);

    if (job.name === "order-created") {
      console.log("🔔 Processing notification...");

      await new Promise((res) => setTimeout(res, 500));

      logger.info(
        `Notification processed for order ${job.data.orderId}`
      );
    } else if (job.name === "gig-request-created") {
      const { id, brandId, influencerId, note } = job.data;
      
      // Feature Flags
      const enableWebPush = process.env.ENABLE_WEB_PUSH === "true";
      const enableEmailNotifications = process.env.ENABLE_EMAIL_NOTIFICATIONS === "true";

      if (process.env.ENABLE_WEB_PUSH === undefined) {
        console.warn("⚠️ WARNING: ENABLE_WEB_PUSH is not defined in env");
      }

      // 1. Save In-App Notification (Always enabled for core platform UX)
      const notification = await NotificationModel.create({
        userId: influencerId,
        type: "GIG_REQUEST",
        title: "New Gig Request",
        message: "New gig request received",
        metadata: { 
          connectionId: id,
          gigRequestId: id, 
          brandId, 
          note 
        }
      });
      logger.info(`Saved in-app notification for ${influencerId}`);
      await emitRealtimeNotification(influencerId, notification);

      // 2. Web Push
      let pushSuccessCount = 0;
      if (enableWebPush) {
        console.log("🔍 Fetching subscriptions for userId:", influencerId);
        const subscriptions = await PushSubscriptionModel.find({ userId: influencerId });
        console.log(`Found ${subscriptions.length} subscriptions`);

        const pushPayload = {
          title: "New Notification",
          body: "You have a new gig request",
          url: `/influencer-dashboard/requests/${id}`
        };

        for (const sub of subscriptions) {
  if (!sub.keys || !sub.keys.p256dh || !sub.keys.auth) {
    console.warn("Skipping invalid subscription:", sub.endpoint);

    // Optional: clean invalid entries
    await PushSubscriptionModel.deleteOne({ _id: sub._id });

    continue;
  }

  console.log("Sending push to:", sub.endpoint);

  const success = await webPushService.sendNotification(
    {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
      },
    },
    pushPayload
  );

  if (success) {
    pushSuccessCount++;
  } else {
    console.log("Push failed, removing subscription:", sub.endpoint);
    await PushSubscriptionModel.deleteOne({ _id: sub._id });
  }
}
      } else {
        logger.info(`Web push skipped (feature flag disabled)`);
      }

      // 3. Email Fallback
      if (pushSuccessCount === 0 && enableEmailNotifications) {
        logger.info(`No successful web push for ${influencerId}, enqueueing email fallback`);
        const influencer = await User.findById(influencerId);
        
        if (influencer) {
          // Scaffolded: Add to email queue
          // await emailQueue.add("send-email", {
          //   to: influencer.email,
          //   template: "gig_request_received",
          //   data: { brandId, note, gigRequestId: id }
          // });
          logger.info(`(Simulated Queue) Enqueued fallback email for ${influencer.email}`);
        }
      } else if (pushSuccessCount === 0) {
        logger.info(`Email fallback skipped (feature flag disabled)`);
      }
    } 
    else if (job.name === "gig-request-accepted") {
  const { id, brandId } = job.data;

  const notification = await NotificationModel.create({
    userId: brandId,
    type: "GIG_REQUEST",
    title: "Request Accepted",
    message: "Your gig request was accepted",
    metadata: {
      connectionId: id,
    },
  });

  logger.info(`Saved accepted notification for ${brandId}`);

  // 🔥 REALTIME
  await emitRealtimeNotification(brandId, notification);

  // 🔔 PUSH
  if (process.env.ENABLE_WEB_PUSH === "true") {
    const subscriptions = await PushSubscriptionModel.find({ userId: brandId });

    const pushPayload = {
      title: "Request Accepted",
      body: "Your gig request was accepted",
      url: `/brand-dashboard/requests/${id}`,
    };

    for (const sub of subscriptions) {
      if (!sub.keys || !sub.keys.p256dh || !sub.keys.auth) {
  logger.warn("Skipping invalid push subscription", { endpoint: sub.endpoint });
  continue;
}

await webPushService.sendNotification(
  {
    endpoint: sub.endpoint,
    keys: {
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
    },
  },
  pushPayload
);
    }
  }
}

else if (job.name === "gig-request-rejected") {
  const { id, brandId } = job.data;

  const notification = await NotificationModel.create({
    userId: brandId,
    type: "GIG_REQUEST",
    title: "Request Rejected",
    message: "Your gig request was rejected",
    metadata: {
      connectionId: id,
    },
  });

  logger.info(`Saved rejected notification for ${brandId}`);

  // 🔥 REALTIME
  await emitRealtimeNotification(brandId, notification);

  // 🔔 PUSH
  if (process.env.ENABLE_WEB_PUSH === "true") {
    const subscriptions = await PushSubscriptionModel.find({ userId: brandId });

    const pushPayload = {
      title: "Request Rejected",
      body: "Your gig request was rejected",
      url: `/brand-dashboard/requests/${id}`,
    };

    for (const sub of subscriptions) {
      if (!sub.keys || !sub.keys.p256dh || !sub.keys.auth) {
  logger.warn("Skipping invalid push subscription", { endpoint: sub.endpoint });
  continue;
}

await webPushService.sendNotification(
  {
    endpoint: sub.endpoint,
    keys: {
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
    },
  },
  pushPayload
);
    }
  }
}
    else if (job.name === "new-message") {
      const { receiverId, conversationId } = job.data;
      
      const notification = await NotificationModel.create({
        userId: receiverId,
        type: "NEW_MESSAGE",
        title: "New Message",
        message: "New message received",
        metadata: {
          conversationId: conversationId
        }
      });
      logger.info(`Saved in-app notification for message in ${conversationId}`);
      await emitRealtimeNotification(receiverId, notification);

      // Web Push for messages
      if (process.env.ENABLE_WEB_PUSH === "true") {
        const subscriptions = await PushSubscriptionModel.find({ userId: receiverId });
        console.log(`Found ${subscriptions.length} subscriptions for message notification`);
        
        const pushPayload = {
          title: "New Message",
          body: "You have received a new message",
          url: `/messages/${conversationId}`
        };

        for (const sub of subscriptions) {
  if (!sub.keys || !sub.keys.p256dh || !sub.keys.auth) {
    console.warn("Skipping invalid subscription:", sub.endpoint);
    continue;
  }

  console.log("Sending push to:", sub.endpoint);

  const success = await webPushService.sendNotification(
    {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
      },
    },
    pushPayload
  );
        }
      }
    }
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);

notificationWorker.on("completed", (job) => {
  console.log(`✅ Job completed: ${job.id}`);
});

notificationWorker.on("failed", (job, err) => {
  console.error(`❌ Job failed: ${job?.id}`, err);
});