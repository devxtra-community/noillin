import mongoose from "mongoose";
import { Types } from "mongoose";
import type { JwtPayload } from "jsonwebtoken";

// import { GigModel } from "../models/gig.model.js";
import { create_gig, findActiveGigById, findGigById, findGigsByInfluencer, findPublishedGigById, findPublishedGigs, getAllGigs, softDeleteGig } from "../repositories/gig.repository.js";
import { type GigDeliverable, type GigType, type Platform } from "../types/gig.type.js";
import { type GigDocument } from "../types/gig.type.js";
import { InfluencerProfile, type IInfluencerProfile } from "../models/influencer.model.js";
import { UserRole } from "../models/user.model.js";


/* ================= TYPES ================= */

interface GigQuery {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: "price_asc" | "price_desc";
  status?: string;
}

interface HttpError extends Error {
  statusCode?: number;
}



//=================GET TOTAL GIGS=================
export const getTotalGigsService = async () => {
  const gigCount = await getAllGigs();
  return gigCount.length;
}

/* ================= LIST GIGS ================= */

export const listGigsService = async (
  query: GigQuery,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {
    isDeleted: false
  };

  if (query.status && query.status !== "all") {
    filter.status = query.status;
  } else if (!query.status) {
    // Default for public marketplace
    filter.status = "published";
  }

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

  const { gigs, total } = await findPublishedGigs(
    filter,
    sort,
    skip,
    limit
  );

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

  const gig = await findPublishedGigById(gigId);
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
): Promise<{
  gig: GigDocument;
  collaborators: string[];
}> => {
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
    isDeleted: false,
    reportCount: 0
  });


  return {
    gig,
    collaborators: input.collaboratorIds ?? []
  }
};

export const updateGigDeliverablesService = async (
  gigId: string,
  userId: string,
  deliverables: GigDeliverable[]
) => {
  const gig = await findGigById(gigId);
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
  const gig = await findGigById(gigId);
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



export const publishGigService = async (
  gigId: string,
  userId: string
) => {
  const gig = await findGigById(gigId);
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

  if (gig.primaryInfluencerId.toString() !== influencerProfile._id.toString()) {
    throw Object.assign(new Error("Unauthorized to publish this gig"), {
      statusCode: 403
    });
  }

  gig.status = "published";
  await gig.save();

  return gig;
};
//* ================= EDIT GIG ================= */




type EditableGigFields = {
  title?: string;
  shortDescription?: string;
  category?: string;
  tags?: string[];
  deliverables?: GigDeliverable[];
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
  if (!mongoose.Types.ObjectId.isValid(gigId)) {
    throw Object.assign(new Error("Invalid gig ID"), { statusCode: 400 });
  }

  if (user.role !== "INFLUENCER") {
    throw Object.assign(new Error("Only influencers can edit gigs"), {
      statusCode: 403
    });
  }

  const influencerProfile = await InfluencerProfile.findOne({
    userId: user.userId
  });

  if (!influencerProfile) {
    throw Object.assign(new Error("Influencer profile not found"), {
      statusCode: 404
    });
  }

  const gig = await findActiveGigById(gigId);

  if (!gig) {
    throw Object.assign(new Error("Gig not found"), { statusCode: 404 });
  }

  if (
    gig.primaryInfluencerId.toString() !==
    influencerProfile._id.toString()
  ) {
    throw Object.assign(new Error("Unauthorized"), {
      statusCode: 403
    });
  }

  if (gig.status === "archived") {
    throw Object.assign(new Error("Archived gig cannot be edited"), {
      statusCode: 400
    });
  }

  // 🔥 SAFE FIELD UPDATES

  if (updateData.title !== undefined) {
    gig.title = updateData.title;
  }

  if (updateData.shortDescription !== undefined) {
    gig.shortDescription = updateData.shortDescription;
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



export const deleteGigService = async (
  gigId: string,
  user: JwtPayload
): Promise<void> => {
  //  Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(gigId)) {
    const err: HttpError = new Error("Invalid gig ID");
    err.statusCode = 400;
    throw err;
  }

  //  Only influencers and admins allowed
  if (user.role !== UserRole.INFLUENCER && user.role !== UserRole.ADMIN) {
    const err: HttpError = new Error("Only influencers and admins can delete gigs");
    err.statusCode = 403;
    throw err;
  }

  // Find gig first
  const gig = await findActiveGigById(gigId);
  if (!gig) {
    const err: HttpError = new Error("Gig not found or already deleted");
    err.statusCode = 404;
    throw err;
  }

  // If user is an influencer, check ownership
  if (user.role === UserRole.INFLUENCER) {
    //  Find influencer profile
    const influencerProfile: IInfluencerProfile | null =
      await InfluencerProfile.findOne({
        userId: user.userId
      });

    if (!influencerProfile) {
      const err: HttpError = new Error("Influencer profile not found");
      err.statusCode = 404;
      throw err;
    }

    //  Ownership check
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
  }

  // Soft delete (influencer ownership confirmed or user is admin)
  await softDeleteGig(gigId);
};

export const getMyGigsService = async (userId: string) => {
  const influencerProfile = await InfluencerProfile.findOne({ userId });

  if (!influencerProfile) {
    throw Object.assign(new Error("Influencer profile not found"), { statusCode: 404 });
  }

  return findGigsByInfluencer(influencerProfile._id);
};



