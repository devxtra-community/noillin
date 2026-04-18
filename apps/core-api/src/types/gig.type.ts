import { Types } from "mongoose";

export type GigStatus =
  | "draft"
  | "published"
  | "flagged"
  | "paused"
  | "under_review"
  | "rejected"
  | "archived";

export type Platform =
  | "instagram"
  | "youtube"
  | "tiktok";

export type GigType =
  | "solo"
  | "collaboration";

export interface GigDeliverable {
  contentType: string;
  quantity: number;
  includedItems: string[];
}

export interface GigPricing {
  basePrice: number;
  currency: "INR" | "USD";
  negotiationAllowed: boolean;
  deliveryTimeInDays: number;
  revisionsIncluded: number;
}

export interface GigReport {
  reportedBy: Types.ObjectId;
  type: "SPAM" | "MISLEADING" | "INAPPROPRIATE" | "COPYRIGHT";
  message?: string;
  resolved: boolean;
  createdAt: Date;
}

export interface GigModerationLog {
  action: "PAUSED" | "REJECTED" | "IGNORED";
  reason?: string;
  adminId: Types.ObjectId;
  createdAt: Date;
}

export interface GigDocument {
  _id: Types.ObjectId;
  title: string;
  shortDescription: string;

  platform: Platform;
  gigType: GigType;

  influencerIds: Types.ObjectId[];
  primaryInfluencerId: Types.ObjectId;

  category: string;
  tags: string[];

  deliverables: GigDeliverable[];

  pricing: GigPricing;

  maxBookingsPerSlot?: number;

  status: GigStatus;

  isDeleted: boolean;
  reportCount: number;
  reports?: GigReport[];
  moderationLogs?: GigModerationLog[];

  createdAt: Date;
  updatedAt: Date;
}

export type CreateGigDBInput = Omit<
  GigDocument,
  "_id" | "createdAt" | "updatedAt"
>;