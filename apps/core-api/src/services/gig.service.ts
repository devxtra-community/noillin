import mongoose from "mongoose";
import { Types } from "mongoose";

import { GigModel } from "../models/gig.model.js";
import { create_gig } from "../repositories/gig.repository.js";
import { type GigDeliverable, type GigType, type Platform } from "../types/gig.type.js";
import { InfluencerProfile } from "../models/influencer.model.js";
import { UserRole } from "../models/user.model.js";
import { findAvailabilityByInfluencer } from "../repositories/availability.repository.js";
import { GigCollaborationModel } from "../models/collaboration.model.js";
import type { WeeklyRule } from "../types/availability.types.js";


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

/* ================= TYPES ================= */

interface CreateGigInput {
  title: string;
  shortDescription: string;
  platform: Platform;
  gigType: GigType;

  category: string;
  tags: string[];

  deliverables: GigDeliverable[];

  basePrice: number;
  currency: "INR" | "USD";
  negotiationAllowed?: boolean;
  deliveryTimeInDays: number;
  revisionsIncluded: number;

  maxBookingsPerSlot?: number;

  collaboratorIds?: string[];
}

/* ================= CREATE GIG ================= */

export const createGigService = async (
  userId: string,
  role: string,
  input: CreateGigInput
) => {
  if (role !== UserRole.INFLUENCER) {
    throw Object.assign(new Error("only influencers can create gigs"), {
      statusCode: 403
    });
  }

  const influencerProfile = await InfluencerProfile.findOne({
    userId: new Types.ObjectId(userId)
  });

  if (!influencerProfile) {
    throw Object.assign(new Error("influencer profile not found"), {
      statusCode: 404
    });
  }

  const gig = await create_gig({
    title: input.title,
    shortDescription: input.shortDescription,
    platform: input.platform,
    gigType: input.gigType,
    category: input.category,
    tags: input.tags,

    influencerIds: [influencerProfile._id],
    primaryInfluencerId: influencerProfile._id,

    pricing: {
      basePrice: 0,
      currency: "INR",
      negotiationAllowed: false,
      deliveryTimeInDays: 1,
      revisionsIncluded: 0
    },

    deliverables: [],

    status: "draft",
    isDeleted: false
  });

  return gig;
};

export const updateGigDeliverablesService = async (
  gigId: string,
  userId: string,
  deliverables: GigDeliverable[]
) => {
  const gig = await GigModel.findById(gigId);

  if (!gig) {
    throw Object.assign(new Error("Gig not found"), { statusCode: 404 });
  }

  const influencerProfile = await InfluencerProfile.findOne({
    userId: new Types.ObjectId(userId)
  });

  if (!influencerProfile) {
    throw Object.assign(new Error("Influencer profile not found"), {
      statusCode: 404
    });
  }

  if (gig.primaryInfluencerId.toString() !== influencerProfile._id.toString()) {
    throw Object.assign(new Error("Unauthorized"), {
      statusCode: 403
    });
  }

  gig.deliverables = deliverables;
  await gig.save();

  return gig;
};

export const updateGigPricingService = async (
  gigId: string,
  userId: string,
  pricingInput: {
    basePrice: number;
    currency: "INR" | "USD";
    negotiationAllowed?: boolean;
    deliveryTimeInDays: number;
    revisionsIncluded: number;
  }
) => {
  const gig = await GigModel.findById(gigId);

  if (!gig) {
    throw Object.assign(new Error("Gig not found"), { statusCode: 404 });
  }

  const influencerProfile = await InfluencerProfile.findOne({
    userId: new Types.ObjectId(userId)
  });

  if (!influencerProfile) {
    throw Object.assign(new Error("Influencer profile not found"), { statusCode: 404 });
  }

  if (gig.primaryInfluencerId.toString() !== influencerProfile._id.toString()) {
    throw Object.assign(new Error("Unauthorized"), { statusCode: 403 });
  }

  gig.pricing = {
    basePrice: pricingInput.basePrice,
    currency: pricingInput.currency,
    negotiationAllowed: pricingInput.negotiationAllowed ?? false,
    deliveryTimeInDays: pricingInput.deliveryTimeInDays,
    revisionsIncluded: pricingInput.revisionsIncluded
  };

  await gig.save();

  return gig;
};

// export const publishGigService = async (
//   gigId: string,
//   userId: string
// ) => {
//   const gig = await GigModel.findById(gigId);

//   if (!gig) {
//     throw Object.assign(new Error("Gig not found"), { statusCode: 404 });
//   }

//   if (gig.primaryInfluencerId.toString() !== userId) {
//     throw Object.assign(new Error("Unauthorized"), { statusCode: 403 });
//   }

//   if (!gig.deliverables.length) {
//     throw Object.assign(new Error("Deliverables required"), { statusCode: 400 });
//   }

//   if (gig.pricing.basePrice <= 0) {
//     throw Object.assign(new Error("Valid pricing required"), { statusCode: 400 });
//   }

//   gig.status = "published";
//   await gig.save();

//   return gig;
// };


export const publishGigService = async (
  gigId: string,
  userId: string
) => {
  const gig = await GigModel.findById(gigId);

  if (!gig) {
    throw Object.assign(new Error("Gig not found"), { statusCode: 404 });
  }

  // 🔥 FIX: resolve influencer profile from userId
  const influencerProfile = await InfluencerProfile.findOne({
    userId: new Types.ObjectId(userId)
  });

  if (!influencerProfile) {
    throw Object.assign(new Error("Influencer profile not found"), {
      statusCode: 404
    });
  }

  if (
    gig.primaryInfluencerId.toString() !==
    influencerProfile._id.toString()
  ) {
    throw Object.assign(new Error("Unauthorized"), { statusCode: 403 });
  }

  if (gig.status === "published") {
    throw Object.assign(new Error("Gig already published"), {
      statusCode: 400
    });
  }

  // Deliverables
  if (!gig.deliverables || gig.deliverables.length === 0) {
    throw Object.assign(new Error("Deliverables required"), {
      statusCode: 400
    });
  }

  // Pricing
  if (
    !gig.pricing ||
    gig.pricing.basePrice <= 0 ||
    gig.pricing.deliveryTimeInDays <= 0
  ) {
    throw Object.assign(new Error("Valid pricing required"), {
      statusCode: 400
    });
  }

  // Availability
  const availability = await findAvailabilityByInfluencer(
    influencerProfile._id
  );

  if (!availability) {
    throw Object.assign(
      new Error("Availability must be set before publishing"),
      { statusCode: 400 }
    );
  }

  // const hasEnabledDay = availability.weeklyRules.some(
  //   (rule: any) => rule.isEnabled && rule.slots.length > 0
  // );
  const hasEnabledDay = availability.weeklyRules.some(
    (rule:WeeklyRule) => rule.isEnabled && rule.slots.length > 0
  );

  if (!hasEnabledDay) {
    throw Object.assign(
      new Error("At least one available slot required"),
      { statusCode: 400 }
    );
  }

  // Collaboration validation
  if (gig.gigType === "collaboration") {
    const pending = await GigCollaborationModel.findOne({
      gigId: new Types.ObjectId(gigId),
      status: "pending"
    });

    if (pending) {
      throw Object.assign(
        new Error("All collaborators must accept before publishing"),
        { statusCode: 400 }
      );
    }

    const rejected = await GigCollaborationModel.findOne({
      gigId: new Types.ObjectId(gigId),
      status: "rejected"
    });

    if (rejected) {
      throw Object.assign(
        new Error("One or more collaborators rejected"),
        { statusCode: 400 }
      );
    }
  }

  gig.status = "published";
  await gig.save();

  return gig;
};