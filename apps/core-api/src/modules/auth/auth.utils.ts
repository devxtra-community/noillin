import jwt from "jsonwebtoken";

import type { AdminLevel, UserRole } from "../users/user.model.js";


const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export interface JwtPayload {
  userId: string;
  role: UserRole;
  adminLevel?: AdminLevel | null;
}

export const signAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
};

export const signRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
};
