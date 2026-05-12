// import { Types } from "mongoose";

// import type { AvailabilityDocument } from "../types/availability.types.js";
// import { AvailabilityModel } from "../models/availability.model.js";

// export const createAvailability = async (
//   data: Omit<AvailabilityDocument, "createdAt" | "updatedAt">
// ) => {
//   return AvailabilityModel.create(data);
// };

// export const findAvailabilityByInfluencer = async (
//   influencerProfileId: Types.ObjectId
// ) => {
//   return AvailabilityModel.findOne({ influencerProfileId });
// };

// export const updateAvailability = async (
//   influencerProfileId: Types.ObjectId,
//   update: Partial<AvailabilityDocument>
// ) => {
//   return AvailabilityModel.findOneAndUpdate(
//     { influencerProfileId },
//     update,
//     { new: true }
//   );
// };

// export const upsertAvailability = async (
//   influencerProfileId: Types.ObjectId,
//   data: Partial<AvailabilityDocument>
// ) => {
//   return AvailabilityModel.findOneAndUpdate(
//     { influencerProfileId },
//     data,
//     { new: true, upsert: true }
//   );
// };

import { AvailabilityModel } from "../models/availability.model.js";

export class AvailabilityRepository {
  async getAvailability(influencerId: string) {
    return AvailabilityModel.findOne({ influencerId });
  }

  async addUnavailableDate(influencerId: string, date: Date, reason?: string) {
    return AvailabilityModel.findOneAndUpdate(
      { influencerId },
      {
        $push: {
          overrides: { date, reason },
        },
      },
      { new: true, upsert: true }
    );
  }

  async removeUnavailableDate(influencerId: string, date: Date) {
    return AvailabilityModel.findOneAndUpdate(
      { influencerId },
      {
        $pull: {
          overrides: { date },
        },
      },
      { new: true }
    );
  }
}