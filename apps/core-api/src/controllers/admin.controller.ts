import type { Request, Response, NextFunction } from "express";

import {
  approveSignupService,
  getAllPendingSignupService,
  rejectSignupService,
  getTotalUsersService,
} from "../services/verification.service.js";
import { getTotalGigsService } from "../services/gig.service.js";
import {
  getRecentActivityService,
  getGigModerationStatsService,
  pauseGigService,
  ignoreGigService,
  rejectGigService
} from "../services/admin.service.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
export const getTotalGigsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const count = await getTotalGigsService()
    res.status(200).json({ success: true, data: count })
  } catch (error) {
    next(error)
  }
}

export const getTotalUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction) => {
  try {
    const count = await getTotalUsersService()
    res.status(200).json({ success: true, data: count });
  } catch (error) {
    next(error)
  }

}

export const approveSignupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const result = await approveSignupService(email);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const rejectSignupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, reason } = req.body;
    const result = await rejectSignupService(email, reason);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getAllpendingSignupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requests = await getAllPendingSignupService(req.query);
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

export const getRecentActivityController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const activities = await getRecentActivityService(limit);
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    next(error);
  }
};

export const getGigModerationStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await getGigModerationStatsService();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

//=================PAUSE GIG=================
export const pauseGigController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const gigId = req.params.gigId as string;
    const { reportId, reason } = req.body;

    const result = await pauseGigService(
      gigId,
      req.user!.userId,
      reportId,
      reason
    );

    res.status(200).json({
      success: true,
      message: "Gig paused successfully",
      data: result
    });

  } catch (error) {
    next(error);
  }
};



//===================IGNORE GIG===================
export const ignoreGigController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const gigId = req.params.gigId as string;
    const { reportId, reason } = req.body;

    const result = await ignoreGigService(
      gigId,
      req.user!.userId,
      reportId,
      reason
    );

    res.status(200).json({
      success: true,
      message: "Reports ignored, gig restored",
      data: result
    });

  } catch (error) {
    next(error);
  }
};

//===================REJECT GIG===================
export const rejectGigController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const gigId = req.params.gigId as string;
    const { reportId, reason } = req.body;

    const result = await rejectGigService(
      gigId,
      req.user!.userId,
      reportId,
      reason
    );

    res.status(200).json({
      success: true,
      message: "Gig rejected",
      data: result
    });

  } catch (error) {
    next(error);
  }
};