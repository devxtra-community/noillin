import { Types } from "mongoose";

export type GigStatus =
  | "draft"
  | "published"
  | "paused"
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

  createdAt: Date;
  updatedAt: Date;
}

export type CreateGigDBInput = Omit<
  GigDocument,
  "_id" | "createdAt" | "updatedAt"
>;