import type { NextFunction, Request, Response } from "express";

import { getGigDetailsService, getMyGigsService, listGigsService, publishGigService, updateGigDeliverablesService, updateGigPricingService } from "../services/gig.service.js";
import type { GigDeliverable } from "../types/gig.type.js";
import { getChannel } from "../queue/rabbit.js";
import { createGigService, deleteGigService, editGigService } from "../services/gig.service.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";




// ================= CREATE GIG =================

export const GIG_CREATED_EVENT = "gig.created";

/* ================= CREATE GIG ================= */


export const createGigController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, role } = req.user!;

    const result = await createGigService(
      userId,
      role,
      req.body
    );

   
      
      getChannel().sendToQueue(
        GIG_CREATED_EVENT,
        Buffer.from(JSON.stringify({
          gigId: result.gig._id.toString(),
          title: result.gig.title,
          category: result.gig.category,
          pricing: result.gig.pricing.basePrice,
          influencerId: result.gig.primaryInfluencerId.toString(),
          createdAt: result.gig.createdAt,
        })),
        { persistent: true }
      );
    


    return res.status(201).json({
      success: true,
      message:
        result.collaborators.length > 0
          ? "Gig created as draft. Waiting for collaborator approval."
          : "Gig created and published successfully.",
      data: result.gig
    });
  } catch (error) {
    next(error);
  }
};

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

    return res.status(200).json({
      success: true,
      data: gig
    });
  } catch (error: unknown) {
    console.error("Error fetching gig details:", error);

    const err = error as HttpError;

    return res.status(err.statusCode || 500).json({
      message: err.message || "Internal server error"
    });
  }
};


// ================= EDIT GIG =================
export const editGigController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // 🔥 Type-safe ID guard
    if (typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid Gig ID"
      });
    }

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const updatedGig = await editGigService(
      id,
      req.user,
      req.body
    );

    return res.status(200).json({
      success: true,
      data: updatedGig
    });

  } catch (error) {
    next(error);
  }
};




//* ================= DELETE GIG =================

export const deleteGigController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate ID exists and is string
    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        message: "Invalid Gig ID"
      });
    }

    // 2️⃣ Ensure authenticated user exists
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    await deleteGigService(id, req.user);

    return res.status(200).json({
      message: "Gig deleted successfully"
    });

  } catch (error: unknown) {
    console.error("Error deleting gig:", error);

    if (error instanceof Error) {
      const statusCode =
        (error as { statusCode?: number }).statusCode ?? 500;

      return res.status(statusCode).json({
        message: error.message
      });
    }

    return res.status(500).json({
      message: "Internal server error"
    });
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

export const getGigController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid Gig ID"
      });
    }

    const gig = await getMyGigsService(id);

    res.status(200).json({
      success: true,
      data: gig
    });

  } catch (error) {
    next(error);
  }
};