import type { NextFunction, Request, Response } from "express";

import { loginService } from "../services/auth.service.js";
import type { HttpError } from "../modules/auth/http-error.js";


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
