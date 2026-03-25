import type { Request, Response, NextFunction } from "express";

import { searchIndex } from "../search/services/search.service.js";
import { buildGigFilters } from "../search/filters/gig.filter.js";
import { buildInfluencerFilters } from "../search/filters/influencer.filter.js";

// ================= SEARCH GIGS =================
export const searchGigs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { q = "", page = 1, limit = 10 } = req.query;

    const filters = buildGigFilters(req.query);

    const options: { limit?: number; offset?: number; filter?: string[] } = {
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    };

    if (filters.length > 0) {
      options.filter = filters;
    }

    const result = await searchIndex("gigs", q as string, options);

    res.status(200).json({
      hits: result.hits,
      total: result.estimatedTotalHits,
      page: Number(page),
      limit: Number(limit),
    });

  } catch (error) {
    next(error);
  }
};

// ================= SEARCH INFLUENCERS =================
export const searchInfluencers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { q = "", page = 1, limit = 10 } = req.query;

    const filters = buildInfluencerFilters(req.query);

    const options: {
      limit?: number;
      offset?: number;
      filter?: string[];
    } = {
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    };

    if (filters.length > 0) {
      options.filter = filters;
    }

    const result = await searchIndex("influencers", q as string, options);

    res.status(200).json({
      hits: result.hits,
      total: result.estimatedTotalHits,
      page: Number(page),
      limit: Number(limit),
    });

  } catch (error) {
    next(error);
  }
};

// ================= SEARCH BRANDS =================
export const searchBrands = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { q = "", page = 1, limit = 10 } = req.query;

    const options: {
      limit?: number;
      offset?: number;
    } = {
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    };

    // 🔥 MAIN LINE
    const result = await searchIndex("brands", q as string, options);

    res.status(200).json({
      hits: result.hits,
      total: result.estimatedTotalHits,
      page: Number(page),
      limit: Number(limit),
    });

  } catch (error) {
    next(error);
  }
};