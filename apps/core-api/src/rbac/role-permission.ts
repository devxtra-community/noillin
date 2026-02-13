
import { UserRole } from "../models/user.model.js";

import { Permission } from "./permission.js";

export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.CREATE_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.APPROVE_SIGNUP,
    Permission.REJECT_SIGNUP,
    Permission.MANAGE_USERS,
  ],
  [UserRole.BRAND]: [
    Permission.CREATE_PROFILE,
    Permission.UPDATE_PROFILE,
  ],
  [UserRole.INFLUENCER]: [
    Permission.CREATE_PROFILE,
    Permission.UPDATE_PROFILE,
  ],
};
