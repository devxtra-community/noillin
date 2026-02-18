import mongoose from "mongoose";

import { GigModel } from "../models/gig.model.js";


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
