import mongoose from "mongoose";
import { Types } from "mongoose";

import { GigModel } from "../models/gig.model.js";
import { create_gig } from "../repositories/gig.repository.js";
import { type GigStatus } from "../types/gig.type.js";
import { InfluencerProfile } from "../models/influencer.model.js";
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
