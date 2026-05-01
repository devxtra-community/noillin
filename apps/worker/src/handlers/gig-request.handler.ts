import { notificationQueue } from "../queue/notification.queue.js";
import { logger } from "../utils/logger.js";

export interface GigRequestPayload {
  id: string;
  brandId: string;
  influencerId: string;
  gigId?: string;
  note?: string;
}

export async function handleGigRequestCreated(data: GigRequestPayload) {
  if (!data.id || !data.influencerId || !data.brandId) {
    throw new Error("Invalid gig_request.created payload");
  }

  // Create unique job ID to prevent duplicates
  const jobId = `notify:gig-req:${data.id}`;

  await notificationQueue.add(
    "gig-request-created",
    data,
    { jobId }
  );

  logger.info(`✅ Enqueued notification job for gig request ${data.id}`);
}

export async function handleGigRequestAccepted(data: GigRequestPayload) {
  await notificationQueue.add("gig-request-accepted", data, {
    jobId: `notify:gig-accepted:${data.id}`,
  });
}

export async function handleGigRequestRejected(data: GigRequestPayload) {
  await notificationQueue.add("gig-request-rejected", data, {
    jobId: `notify:gig-rejected:${data.id}`,
  });
}