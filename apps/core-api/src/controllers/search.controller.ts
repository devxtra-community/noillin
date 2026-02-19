import type { Request, Response, NextFunction } from "express";

import { searchIndex } from "../search/services/search.service.js";
import { buildGigFilters } from "../search/filters/gig.filter.js";

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
