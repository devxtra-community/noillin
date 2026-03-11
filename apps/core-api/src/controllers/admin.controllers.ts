import type { Request, Response, NextFunction } from "express";

import { approveSignupService, getAllPendingSignupService, rejectSignupService } from "../services/verification.service.js";

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
