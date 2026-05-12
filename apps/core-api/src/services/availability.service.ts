import mongoose from "mongoose";
// import { Types } from "mongoose";

// import { UserRole } from "../models/user.model.js";
// import { createHttpError } from "../modules/auth/http-error.js";
// import { InfluencerProfile } from "../models/influencer.model.js";
// import { findAvailabilityByInfluencer, upsertAvailability } from "../repositories/availability.repository.js";
// import type { DateOverride, WeeklyRule } from "../types/availability.types.js";


// interface SetAvailabilityInput {
//   timezone: string;
//   weeklyRules: WeeklyRule[];
//   dateOverrides: DateOverride[];
// }

// export const setAvailabilityService = async (
//   userId: string,
//   role: string,
//   input: SetAvailabilityInput
// ) => {
//   if (role !== UserRole.INFLUENCER) {
//     throw createHttpError("Only influencers can set availability", 403);
//   }

//   const influencerProfile = await InfluencerProfile.findOne({
//     userId: new Types.ObjectId(userId)
//   });

//   if (!influencerProfile) {
//     throw createHttpError("Influencer profile not found", 404);
//   }

//   const availability = await upsertAvailability(
//     influencerProfile._id,
//     {
//       influencerProfileId: influencerProfile._id,
//       timezone: input.timezone,
//       weeklyRules: input.weeklyRules,
//       dateOverrides: input.dateOverrides
//     }
//   );

//   return availability;
// };

// export const getAvailabilityService = async (
//   influencerProfileId: string
// ) => {
//   const availability = await findAvailabilityByInfluencer(
//     new Types.ObjectId(influencerProfileId)
//   );

//   if (!availability) {
//     throw createHttpError("Availability not found", 404);
//   }

//   return availability;
// };


import { AvailabilityRepository } from "../repositories/availability.repository.js";

const repo = new AvailabilityRepository();

export class AvailabilityService {
  async addUnavailableDate(
    influencerId: string,
    date: Date,
    reason?: string
  ) {
    return repo.addUnavailableDate(influencerId, date, reason);
  }

  async removeUnavailableDate(influencerId: string, date: Date) {
    return repo.removeUnavailableDate(influencerId, date);
  }

  //  FINAL SIMPLE LOGIC
  async isAvailableToday(influencerId: string) {
    try {
      if (!influencerId || !mongoose.Types.ObjectId.isValid(influencerId)) {
        console.warn("Invalid influencerId for availability check:", influencerId);
        return true; // Fail open
      }

      const today = new Date();
      const availability = await repo.getAvailability(influencerId);

      // If no record → available
      if (!availability || !availability.overrides) return true;

      const isBlocked = availability.overrides.find(
        (o: { date: Date | string }) =>
          new Date(o.date).toDateString() === today.toDateString()
      );

      return !isBlocked;
    } catch (error) {
      console.error("isAvailableToday error:", error);
      return true; // Fail open
    }
  }
}