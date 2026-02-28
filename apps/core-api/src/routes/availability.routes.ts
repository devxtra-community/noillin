import { Router } from "express";

import { authenticate, authorizePermission } from "../middlewares/auth.middleware.js";
import { Permission } from "../rbac/permission.js";
import { getAvailabilityController, setAvailabilityController } from "../controllers/availability.controller.js";

const router: Router = Router();


router.post(
  "/",
  authenticate,
  authorizePermission(Permission.UPDATE_PROFILE),
  setAvailabilityController
);


router.get(
  "/:influencerProfileId",
  getAvailabilityController
);

export default router;