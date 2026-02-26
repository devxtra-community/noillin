import { Types } from "mongoose";

import type { AvailabilityDocument } from "../types/availability.types.js";
import { AvailabilityModel } from "../models/availability.model.js";

export const createAvailability = async (
  data: Omit<AvailabilityDocument, "createdAt" | "updatedAt">
) => {
  return AvailabilityModel.create(data);
};

export const findAvailabilityByInfluencer = async (
  influencerProfileId: Types.ObjectId
) => {
  return AvailabilityModel.findOne({ influencerProfileId });
};

export const updateAvailability = async (
  influencerProfileId: Types.ObjectId,
  update: Partial<AvailabilityDocument>
) => {
  return AvailabilityModel.findOneAndUpdate(
    { influencerProfileId },
    update,
    { new: true }
  );
};

export const upsertAvailability = async (
  influencerProfileId: Types.ObjectId,
  data: Partial<AvailabilityDocument>
) => {
  return AvailabilityModel.findOneAndUpdate(
    { influencerProfileId },
    data,
    { new: true, upsert: true }
  );
};