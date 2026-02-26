import type { NextFunction, Request, Response } from "express";

import {
  getAvailabilityService,
  setAvailabilityService
} from "../services/availability.service.js";

export const setAvailabilityController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, role } = req.user!;

    const availability = await setAvailabilityService(
      userId,
      role,
      req.body
    );

    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailabilityController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const influencerProfileId = req.params.influencerProfileId as string;

    const availability = await getAvailabilityService(
      influencerProfileId
    );

    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (error) {
    next(error);
  }
};