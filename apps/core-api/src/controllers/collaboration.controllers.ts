import type { Request, Response, NextFunction } from "express";

import {
  inviteCollaboratorsService,
  respondToCollaborationService
} from "../services/collaboration.service.js";

export const inviteCollaboratorsController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user!;
    const { id } = req.params;

    const collaborations = await inviteCollaboratorsService(
      id,
      userId,
      req.body.collaboratorIds
    );

    res.status(201).json({
      success: true,
      data: collaborations
    });
  } catch (err) {
    next(err);
  }
};

export const respondToCollaborationController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user!;
    const { id } = req.params;
    const { action } = req.body;

    const result = await respondToCollaborationService(
      id,
      userId,
      action
    );

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};