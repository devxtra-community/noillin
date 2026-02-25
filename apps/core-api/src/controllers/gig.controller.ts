import type { NextFunction, Request, Response } from "express";

import { channel } from "../queue/rabbit.js";
import { createGigService, getGigDetailsService, listGigsService } from "../services/gig.service.js";

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

export const GIG_CREATED_EVENT = "gig.created";


export const createGigController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, role } = req.user!;
    console.log("Pricing Object check:", req.body.pricing);


    const result = await createGigService(
      userId,
      role,
      req.body
    );

    if (channel) {
      await channel.assertQueue(GIG_CREATED_EVENT, { durable: true });

      channel.sendToQueue(
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
    }

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
