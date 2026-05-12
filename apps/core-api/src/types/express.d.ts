import type { JwtPayload } from "../modules/auth/auth.utils.ts";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
