import { Router } from "express";

import { authenticate, authorizePermission } from "../middlewares/auth.middleware.js";
import { Permission } from "../rbac/permission.js";
import { getAvailabilityController, setAvailabilityController } from "../controllers/availability.controller.js";

const router: Router = Router();

/**
 * Create or update availability (Step 4)
 */
router.post(
  "/",
  authenticate,
  authorizePermission(Permission.UPDATE_PROFILE),
  setAvailabilityController
);

/**
 * Get availability by influencer profile id
 */
router.get(
  "/:influencerProfileId",
  getAvailabilityController
);

export default router;