import type { NextFunction, Request, Response } from "express";

import { logoutService, refreshTokenService } from "../services/auth.service.js";
import { loginService, signupService } from "../services/auth.service.js";
import type { HttpError } from "../modules/auth/http-error.js";

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, role, documents } = req.body;

    if (!email || !password || !role) {
      const err: HttpError = new Error("Missing required fields");
      err.statusCode = 400;
      throw err;
    }

    const result = await signupService({
      email,
      password,
      role,
      documents: documents ?? [],
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err: HttpError = new Error("Email and password required");
      err.statusCode = 400;
      throw err;
    }

    const data = await loginService(email, password);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};


export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    const result = await refreshTokenService(refreshToken);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId; 
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
}
    const result = await logoutService(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
