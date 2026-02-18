import { Types } from "mongoose";

export type GigStatus =
  | "draft"
  | "published"
  | "paused"
  | "archived";

export interface GigPricing {
  basePrice: number;
  currency: "INR" | "USD";
  negotiationAllowed: boolean;
}

export interface GigDocument {
  title: string;
  description: string;

  // Only ACCEPTED collaborators go here
  influencerIds: Types.ObjectId[];

  // Owner of the gig
  primaryInfluencerId: Types.ObjectId;

  category: string;
  tags: string[];

  pricing: GigPricing;

  deliverables: string[];

  maxBookingsPerSlot?: number;

  status: GigStatus;


  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}
