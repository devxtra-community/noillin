import { Types } from "mongoose";

import { UserRole } from "../models/user.model.js";
import { createHttpError } from "../modules/auth/http-error.js";
import { InfluencerProfile } from "../models/influencer.model.js";
import { findAvailabilityByInfluencer, upsertAvailability } from "../repositories/availability.repository.js";
import type { DateOverride, WeeklyRule } from "../types/availability.types.js";


interface SetAvailabilityInput {
  timezone: string;
  weeklyRules: WeeklyRule[];
  dateOverrides: DateOverride[];
}

export const setAvailabilityService = async (
  userId: string,
  role: string,
  input: SetAvailabilityInput
) => {
  if (role !== UserRole.INFLUENCER) {
    throw createHttpError("Only influencers can set availability", 403);
  }

  const influencerProfile = await InfluencerProfile.findOne({
    userId: new Types.ObjectId(userId)
  });

  if (!influencerProfile) {
    throw createHttpError("Influencer profile not found", 404);
  }

  const availability = await upsertAvailability(
    influencerProfile._id,
    {
      influencerProfileId: influencerProfile._id,
      timezone: input.timezone,
      weeklyRules: input.weeklyRules,
      dateOverrides: input.dateOverrides
    }
  );

  return availability;
};

export const getAvailabilityService = async (
  influencerProfileId: string
) => {
  const availability = await findAvailabilityByInfluencer(
    new Types.ObjectId(influencerProfileId)
  );

  if (!availability) {
    throw createHttpError("Availability not found", 404);
  }

  return availability;
};