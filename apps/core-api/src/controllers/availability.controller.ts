// import type { NextFunction, Request, Response } from "express";

// import {
//   getAvailabilityService,
//   setAvailabilityService
// } from "../services/availability.service.js";

// export const setAvailabilityController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { userId, role } = req.user!;

//     const availability = await setAvailabilityService(
//       userId,
//       role,
//       req.body
//     );

//     res.status(200).json({
//       success: true,
//       data: availability
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getAvailabilityController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const influencerProfileId = req.params.influencerProfileId as string;

//     const availability = await getAvailabilityService(
//       influencerProfileId
//     );

//     res.status(200).json({
//       success: true,
//       data: availability
//     });
//   } catch (error) {
//     next(error);
//   }
// };

import type{ Response } from "express";

import { AvailabilityService } from "../services/availability.service.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

const service = new AvailabilityService();

export class AvailabilityController {
  async addUnavailable(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const influencerId = req.user.userId;
    const { date, reason } = req.body;

    const data = await service.addUnavailableDate(
      influencerId,
      new Date(date),
      reason
    );

    res.json({
      success: true,
      message: "Date marked as unavailable",
      data,
    });
  }

  async removeUnavailable(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const influencerId = req.user.userId;
    const { date } = req.body;

    const data = await service.removeUnavailableDate(
      influencerId,
      new Date(date)
    );

    res.json({
      success: true,
      message: "Unavailable date removed",
      data,
    });
  }

  async checkToday(req: AuthRequest, res: Response) {
    const influencerId = req.params.influencerId as string;

    const isAvailable = await service.isAvailableToday(influencerId);

    res.json({
      success: true,
      data: { isAvailable },
    });
  }
}