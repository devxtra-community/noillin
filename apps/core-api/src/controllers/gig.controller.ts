import type { Request, Response } from "express";

import { getGigDetailsService, listGigsService } from "../services/gig.service.js";

/* ================= LIST GIGS ================= */

export const listGigsController = async (
  req: Request,
  res: Response
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await listGigsService(req.query, page, limit);

    return res.status(200).json(result);
  } catch (error: unknown) {
    console.error("Error listing gigs:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

/* ================= GET GIG DETAILS ================= */

interface HttpError extends Error {
  statusCode?: number;
}

export const getGigDetailsController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const gig = await getGigDetailsService(id);

    return res.status(200).json(gig);
  } catch (error: unknown) {
    console.error("Error fetching gig details:", error);

    const err = error as HttpError;

    return res.status(err.statusCode || 500).json({
      message: err.message || "Internal server error"
    });
  }
};
