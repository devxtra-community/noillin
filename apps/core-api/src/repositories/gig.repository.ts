import type { SortOrder, Types } from "mongoose";

import { GigModel } from "../models/gig.model.js";
import type { CreateGigDBInput, GigDocument } from "../types/gig.type.js";

export const create_gig = async (
  data: CreateGigDBInput
) => {
  return GigModel.create(data);
};
/* ================= FIND BY ID ================= */

export const findGigById = async (
  gigId: string | Types.ObjectId
) => {
  return GigModel.findById(gigId);
};

/* ================= UPDATE ================= */

export const updateGigById = async (
  gigId: string | Types.ObjectId,
  updateData: Partial<GigDocument>
) => {
  return GigModel.findByIdAndUpdate(
    gigId,
    updateData,
    { new: true }
  );
};

/* ================= SOFT DELETE ================= */

export const softDeleteGig = async (
  gigId: string | Types.ObjectId
) => {
  return GigModel.findByIdAndUpdate(
    gigId,
    { isDeleted: true },
    { new: true }
  );
};
export const findPublishedGigs = async (
  filter: Partial<GigDocument>,
  sort: Record<string, SortOrder>,
  skip: number,
  limit: number
) => {
  const [gigs, total] = await Promise.all([
    GigModel.find(filter)
      .select(
        "title category pricing.basePrice pricing.currency primaryInfluencerId createdAt influencer"
      )
      .populate("primaryInfluencerId", "displayName profileImage availableFrom platforms")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    GigModel.countDocuments(filter)
  ]);

  return { gigs, total };
};
// export const findPublishedGigs = async (
//   filter: any,
//   sort: any,
//   skip: number,
//   limit: number
// ) => {
//   const [gigs, total] = await Promise.all([
//     GigModel.find(filter)
//       .select(
//         "title category pricing.basePrice pricing.currency primaryInfluencerId createdAt"
//       )
//       .sort(sort)
//       .skip(skip)
//       .limit(limit)
//       .lean(),
//     GigModel.countDocuments(filter)
//   ]);

//   return { gigs, total };
// };
export const findPublishedGigById = async (gigId: string) => {
  return GigModel.findOne({
    _id: gigId,
    status: "published",
    isDeleted: false
  })
    .populate({
      path: "primaryInfluencerId",
      select: "displayName profileImage followersCount ratingAvg"
    })
    .lean();
};

export const findActiveGigById = async (
  gigId: string | Types.ObjectId
) => {
  return GigModel.findOne({
    _id: gigId,
    isDeleted: false
  });
};

export const findGigsByInfluencer = async (
  influencerProfileId: string | Types.ObjectId
) => {
  return GigModel.find({
    primaryInfluencerId: influencerProfileId,
    isDeleted: false
  }).sort({ createdAt: -1 });
};