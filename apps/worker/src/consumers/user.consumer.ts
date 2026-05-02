import { Channel, ConsumeMessage } from "amqplib";

import { logger } from "../utils/logger";
import { NotificationModel } from "../../../core-api/src/models/notification.model";
import { sendTransactionalEmail } from "../../../core-api/src/utils/sendotpEmail";

export const USER_CREATED_EVENT = "user.created";
export const USER_APPROVED_EVENT = "user.approved";

export async function startUserConsumer(channel: Channel) {
  await channel.assertQueue(USER_CREATED_EVENT, { durable: true });
  await channel.assertQueue(USER_APPROVED_EVENT, { durable: true });
  await channel.assertQueue("notification.created", { durable: true });

  channel.consume(USER_CREATED_EVENT, async (msg: ConsumeMessage | null) => {
    if (!msg) return;
    try {
      const data = JSON.parse(msg.content.toString());
      logger.info(`Received user.created event for ${data.email}`);

      // We use data.userId as fallback adminId if there isn't a specific admin user
      const adminId = data.adminId || data.userId;

      const notification = await NotificationModel.create({
        userId: adminId,
        type: "USER_PENDING_APPROVAL",
        title: "New User Pending Approval",
        message: `User ${data.email} is pending approval`,
        metadata: { userId: data.userId, email: data.email, role: data.role }
      });

      // Publish notification.created
      channel.sendToQueue("notification.created", Buffer.from(JSON.stringify(notification)), { persistent: true });

      channel.ack(msg);
    } catch (err) {
      logger.error("Failed processing user.created", err);
      channel.nack(msg, false, false);
    }
  });

  channel.consume(USER_APPROVED_EVENT, async (msg: ConsumeMessage | null) => {
    if (!msg) return;
    try {
      const data = JSON.parse(msg.content.toString());
      logger.info(`Received user.approved event for ${data.email}`);

      // Send email using EXISTING nodemailer config
      await sendTransactionalEmail(
        data.email,
        "Account Approved",
        "Your account has been approved. You can now log in."
      );

      // Create notification for user
      const notification = await NotificationModel.create({
        userId: data.userId,
        type: "USER_APPROVED",
        title: "Account Approved",
        message: "Your account has been approved. You can now log in.",
        metadata: { userId: data.userId, email: data.email }
      });

      // Publish notification.created
      channel.sendToQueue("notification.created", Buffer.from(JSON.stringify(notification)), { persistent: true });

      channel.ack(msg);
    } catch (err) {
      logger.error("Failed processing user.approved", err);
      channel.nack(msg, false, false);
    }
  });

  logger.info("Worker consuming user.created and user.approved queues");
}
