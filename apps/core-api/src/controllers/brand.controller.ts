import type { Request, Response, NextFunction } from "express";

import { getPublicBrandProfileService } from "../services/brand.service.js";

export const getPublicBrandProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { brandId } = req.params;

    if (!brandId || Array.isArray(brandId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid brandId"
      });
    }

    const brand = await getPublicBrandProfileService(brandId);

    res.status(200).json({
      success: true,
      data: brand
    });

  } catch (error) {
    next(error);
  }
};