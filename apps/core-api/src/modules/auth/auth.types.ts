import { UserRole, AdminLevel } from "../users/user.model.js";

export interface JwtPayload {
  userId: string;
  role: UserRole;
  adminLevel?: AdminLevel | null;
}
