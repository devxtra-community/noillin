import type { Request, Response, NextFunction } from "express";

import { generateUploadUrlService } from "../services/media.service.js";

export const generateUploadUrlController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { fileName, fileType, folder } = req.body;

    const result = await generateUploadUrlService(
      folder,
      fileName,
      fileType
    );

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
};
