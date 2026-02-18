import { Types } from "mongoose";

export type CollaborationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled";

export interface GigCollaborationDocument {
  gigId: Types.ObjectId;

  primaryInfluencerId: Types.ObjectId;

  invitedInfluencerId: Types.ObjectId;

  status: CollaborationStatus;

  respondedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}
