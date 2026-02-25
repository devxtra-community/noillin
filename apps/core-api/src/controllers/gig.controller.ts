import type { NextFunction, Request, Response } from "express";

import { createGigService, getGigDetailsService, listGigsService, publishGigService, updateGigDeliverablesService, updateGigPricingService } from "../services/gig.service.js";
import type { GigDeliverable } from "../types/gig.type.js";

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


/* ================= CREATE GIG ================= */

export const createGigController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, role } = req.user!;

    const gig = await createGigService(
      userId,
      role,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Gig draft created successfully.",
      data: gig
    });
  } catch (error) {
    next(error);
  }
};

/* ================= PUBLISH GIG ================= */

export const publishGigController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user!;

    const id = req.params.id as string;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Gig id is required"
      });
    }

    const gig = await publishGigService(id, userId);

    res.status(200).json({
      success: true,
      message: "Gig published successfully",
      data: gig
    });
  } catch (err) {
    next(err);
  }
};

/* ================= UPDATE DELIVERABLES ================= */

export const updateGigDeliverablesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user!;
    const id = req.params.id as string;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Gig id is required"
      });
    }

    const deliverables = req.body as GigDeliverable[];

    const gig = await updateGigDeliverablesService(
      id,
      userId,
      deliverables
    );

    res.status(200).json({
      success: true,
      message: "Deliverables updated successfully",
      data: gig
    });
  } catch (error) {
    next(error);
  }
};

/* ================= UPDATE PRICING ================= */

export const updateGigPricingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user!;
    const id = req.params.id as string;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Gig id is required"
      });
    }

    const gig = await updateGigPricingService(
      id,
      userId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Pricing updated successfully",
      data: gig
    });
  } catch (error) {
    next(error);
  }
};