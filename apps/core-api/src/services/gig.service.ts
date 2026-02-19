import mongoose from "mongoose";
import { Types } from "mongoose";
import type { JwtPayload } from "jsonwebtoken";

import { GigModel } from "../models/gig.model.js";
import { create_gig } from "../repositories/gig.repository.js";
import { type GigDocument, type GigStatus } from "../types/gig.type.js";
import { InfluencerProfile, type IInfluencerProfile } from "../models/influencer.model.js";
import { UserRole } from "../models/user.model.js";


/* ================= TYPES ================= */

interface GigQuery {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: "price_asc" | "price_desc";
}

interface HttpError extends Error {
  statusCode?: number;
}

/* ================= LIST GIGS ================= */

export const listGigsService = async (
  query: GigQuery,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

const filter: Record<string, unknown> = {

    status: "published",
    isDeleted: false
  };

  // Category filter
  if (query.category) {
    filter.category = query.category;
  }

  // Price filter
  if (query.minPrice || query.maxPrice) {
    const priceFilter: {
      $gte?: number;
      $lte?: number;
    } = {};

    if (query.minPrice) {
      priceFilter.$gte = Number(query.minPrice);
    }

    if (query.maxPrice) {
      priceFilter.$lte = Number(query.maxPrice);
    }

    filter["pricing.basePrice"] = priceFilter;
  }

  // Sorting
  let sort: Record<string, 1 | -1> = { createdAt: -1 };

  if (query.sort === "price_asc") {
    sort = { "pricing.basePrice": 1 };
  }

  if (query.sort === "price_desc") {
    sort = { "pricing.basePrice": -1 };
  }

  const [gigs, total] = await Promise.all([
    GigModel.find(filter)
      .select(
        "title category pricing.basePrice pricing.currency primaryInfluencerId createdAt"
      )
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    GigModel.countDocuments(filter)
  ]);

  return {
    data: gigs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/* ================= GET GIG DETAILS ================= */

export const getGigDetailsService = async (gigId: string) => {
  if (!mongoose.Types.ObjectId.isValid(gigId)) {
    const err = new Error("Invalid gig ID") as HttpError;
    err.statusCode = 400;
    throw err;
  }

  const gig = await GigModel.findOne({
    _id: gigId,
    status: "published",
    isDeleted: false
  })
    .populate({
      path: "primaryInfluencerId",
      select: "displayName profileImage followersCount ratingAvg"
    })
    .lean();

  if (!gig) {
    const err = new Error("Gig not found") as HttpError;
    err.statusCode = 404;
    throw err;
  }

  return gig;
};


interface CreateGigInput {
  title: string;
  description: string;
  category: string;
  tags: string[];

  basePrice: number;
  currency: "INR" | "USD";
  negotiationAllowed?: boolean;

  deliverables: string[];
  maxBookingsPerSlot?: number;

  collaboratorIds?: string[]; // optional
}

export const createGigService = async (
  userId: string,
  role: string,
  input: CreateGigInput
) => {
  if (role !== UserRole.INFLUENCER) {
    const err = new Error("only influencers can create gigs") as HttpError;
    err.statusCode = 403;
    throw err;
  }

  const influencerProfile = await InfluencerProfile.findOne({
    userId: new Types.ObjectId(userId)
  });

  if (!influencerProfile) {

    const err = new Error("influencer profile not found") as HttpError;
    err.statusCode = 404;
    throw err;
  }

  const primaryInfluencerId = influencerProfile._id;

  const collaboratorObjectIds =
    input.collaboratorIds?.map((id) => new Types.ObjectId(id)) ?? [];

  const hasCollaborators = collaboratorObjectIds.length > 0;

  const status: GigStatus = hasCollaborators
    ? "draft"
    : "published";
const gig = await create_gig({
  title: input.title,
  description: input.description,
  category: input.category,
  tags: input.tags,

  pricing: {
    basePrice: input.basePrice,
    currency: input.currency,
    negotiationAllowed: input.negotiationAllowed ?? false
  },

  deliverables: input.deliverables,

  ...(input.maxBookingsPerSlot !== undefined && {
    maxBookingsPerSlot: input.maxBookingsPerSlot
  }),

  influencerIds: [primaryInfluencerId],
  primaryInfluencerId,

  status,
  isDeleted: false
});


  return {
    gig,
    collaborators: collaboratorObjectIds
  };
};

//* ================= EDIT GIG ================= */


interface HttpError extends Error {
  statusCode?: number;
}

type EditableGigFields = {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  deliverables?: string[];
  pricing?: {
    basePrice: number;
    currency: "INR" | "USD";
    negotiationAllowed?: boolean;
  };
  maxBookingsPerSlot?: number;
  status?: "draft" | "published" | "paused" | "archived";
};

export const editGigService = async (
  gigId: string,
  user: JwtPayload,
  updateData: EditableGigFields
) => {
  // 1️⃣ Validate Gig ID
  if (!mongoose.Types.ObjectId.isValid(gigId)) {
    const err: HttpError = new Error("Invalid gig ID");
    err.statusCode = 400;
    throw err;
  }

  // 2️⃣ Ensure user role is INFLUENCER
  if (user.role !== "INFLUENCER") {
    const err: HttpError = new Error("Only influencers can edit gigs");
    err.statusCode = 403;
    throw err;
  }

  // 3️⃣ Find influencer profile using userId from JWT
  const influencerProfile = await InfluencerProfile.findOne({
    userId: user.userId
  });

  if (!influencerProfile) {
    const err: HttpError = new Error("Influencer profile not found");
    err.statusCode = 404;
    throw err;
  }

  // 4️⃣ Find gig (must not be deleted)
  const gig = await GigModel.findOne({
    _id: gigId,
    isDeleted: false
  });

  if (!gig) {
    const err: HttpError = new Error("Gig not found");
    err.statusCode = 404;
    throw err;
  }

  // 5️⃣ Ownership check
  if (
    gig.primaryInfluencerId.toString() !==
    influencerProfile._id.toString()
  ) {
    const err: HttpError = new Error(
      "You are not allowed to edit this gig"
    );
    err.statusCode = 403;
    throw err;
  }

  // 6️⃣ Safe field updates (no any, no unsafe casting)

  if (updateData.title !== undefined) {
    gig.title = updateData.title;
  }

  if (updateData.description !== undefined) {
    gig.description = updateData.description;
  }

  if (updateData.category !== undefined) {
    gig.category = updateData.category;
  }

  if (updateData.tags !== undefined) {
    gig.tags = updateData.tags;
  }

  if (updateData.deliverables !== undefined) {
    gig.deliverables = updateData.deliverables;
  }
if (updateData.pricing !== undefined) {
  if (updateData.pricing.basePrice !== undefined) {
    gig.pricing.basePrice = updateData.pricing.basePrice;
  }

  if (updateData.pricing.currency !== undefined) {
    gig.pricing.currency = updateData.pricing.currency;
  }

  if (updateData.pricing.negotiationAllowed !== undefined) {
    gig.pricing.negotiationAllowed =
      updateData.pricing.negotiationAllowed;
  }
}

  if (updateData.maxBookingsPerSlot !== undefined) {
    gig.maxBookingsPerSlot = updateData.maxBookingsPerSlot;
  }

  if (updateData.status !== undefined) {
    gig.status = updateData.status;
  }

  await gig.save();

  return gig;
};



//* ================= DELETE GIG =================


interface HttpError extends Error {
  statusCode?: number;
}

export const deleteGigService = async (
  gigId: string,
  user: JwtPayload
): Promise<void> => {
  // 1️⃣ Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(gigId)) {
    const err: HttpError = new Error("Invalid gig ID");
    err.statusCode = 400;
    throw err;
  }

  // 2️⃣ Only influencers allowed
  if (user.role !== "INFLUENCER") {
    const err: HttpError = new Error("Only influencers can delete gigs");
    err.statusCode = 403;
    throw err;
  }

  // 3️⃣ Find influencer profile
  const influencerProfile: IInfluencerProfile | null =
    await InfluencerProfile.findOne({
      userId: user.userId
    });

  if (!influencerProfile) {
    const err: HttpError = new Error("Influencer profile not found");
    err.statusCode = 404;
    throw err;
  }

  // 4️⃣ Find gig
 const gig = await GigModel.findOne({
  _id: gigId,
  isDeleted: false
});


  if (!gig) {
    const err: HttpError = new Error("Gig not found or already deleted");
    err.statusCode = 404;
    throw err;
  }

  // 5️⃣ Ownership check
  if (
    gig.primaryInfluencerId.toString() !==
    influencerProfile._id.toString()
  ) {
    const err: HttpError = new Error(
      "You are not allowed to delete this gig"
    );
    err.statusCode = 403;
    throw err;
  }

  // 6️⃣ Soft delete
  gig.isDeleted = true;
  gig.status = "archived";

  await gig.save();
};