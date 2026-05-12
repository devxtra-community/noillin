import { Types } from "mongoose";

import { GigModel } from "../models/gig.model.js";
import { InfluencerProfile } from "../models/influencer.model.js";
import {
  createCollaboration,
  findCollaborationById,
  updateCollaborationStatus
} from "../repositories/collaboration.repository.js";

export const inviteCollaboratorsService = async (
  gigId: string,
  userId: string,
  collaboratorIds: string[]
) => {
  const gig = await GigModel.findById(gigId);

  if (!gig) {
    throw Object.assign(new Error("Gig not found"), { statusCode: 404 });
  }

  if (gig.primaryInfluencerId.toString() !== userId) {
    throw Object.assign(new Error("Unauthorized"), { statusCode: 403 });
  }

  const collaborations = [];

  for (const id of collaboratorIds) {
    const profile = await InfluencerProfile.findById(id);
    if (!profile) continue;

    const collab = await createCollaboration({
      gigId: gig._id,
      primaryInfluencerId: gig.primaryInfluencerId,
      invitedInfluencerId: new Types.ObjectId(id),
      status: "pending"
    });

    collaborations.push(collab);
  }

  return collaborations;
};

export const respondToCollaborationService = async (
  collaborationId: string,
  userId: string,
  action: "accepted" | "rejected"
) => {
  const collaboration = await findCollaborationById(
    new Types.ObjectId(collaborationId)
  );

  if (!collaboration) {
    throw Object.assign(new Error("Collaboration not found"), {
      statusCode: 404
    });
  }

  if (collaboration.invitedInfluencerId.toString() !== userId) {
    throw Object.assign(new Error("Unauthorized"), {
      statusCode: 403
    });
  }

  const updated = await updateCollaborationStatus(
    collaboration._id,
    action
  );

  if (action === "accepted") {
    await GigModel.findByIdAndUpdate(collaboration.gigId, {
      $addToSet: {
        influencerIds: collaboration.invitedInfluencerId
      }
    });
  }

  return updated;
};