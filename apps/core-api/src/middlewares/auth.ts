import type { Request, Response, NextFunction } from "express";

export const authenticate = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  next();
};

export const authorize = (..._roles: string[]) => {
  return (_req: Request, _res: Response, next: NextFunction) => {
    next();
  };
};
