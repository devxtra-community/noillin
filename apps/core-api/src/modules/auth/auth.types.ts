import { UserRole, AdminLevel } from "../../models/user.model.js";

export interface JwtPayload {
  userId: string;
  role: UserRole;
  adminLevel?: AdminLevel | null;
}
