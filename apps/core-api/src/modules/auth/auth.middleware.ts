import type { Request, Response, NextFunction } from "express";

import { verifyAccessToken } from "./auth.utils.js";
import type { JwtPayload } from "./auth.utils.js";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

interface HttpError extends Error {
  statusCode?: number;
}
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const err: HttpError = new Error("Authorization token missing");
      err.statusCode = 401;
      throw err;
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      const err: HttpError = new Error("Invalid authorization format");
      err.statusCode = 401;
      throw err;
    }

    const token = parts[1]!;
    const decoded = verifyAccessToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    const err = error as HttpError;
  if (!err.statusCode) err.statusCode = 401;
  next(err);
}

};
