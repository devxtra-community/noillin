import { Types } from "mongoose";

import type { GigCollaborationDocument } from "../types/collaboration.type.js";
import { GigCollaborationModel } from "../models/collaboration.model.js";


export const createCollaboration = async (
  data: Omit<GigCollaborationDocument, "createdAt" | "updatedAt">
) => {
  return GigCollaborationModel.create(data);
};

export const findPendingCollaborationsByGig = async (
  gigId: Types.ObjectId
) => {
  return GigCollaborationModel.find({
    gigId,
    status: "pending"
  });
};

export const findCollaborationById = async (
  id: Types.ObjectId
) => {
  return GigCollaborationModel.findById(id);
};

export const updateCollaborationStatus = async (
  id: Types.ObjectId,
  status: "accepted" | "rejected"
) => {
  return GigCollaborationModel.findByIdAndUpdate(
    id,
    {
      status,
      respondedAt: new Date()
    },
    { new: true }
  );
};