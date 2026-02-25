import { Router } from "express";

import { createGigController, getGigDetailsController, listGigsController, publishGigController, updateGigDeliverablesController, updateGigPricingController } from "../controllers/gig.controller.js";
import { authenticate, authorizePermission } from "../middlewares/auth.middleware.js";
import { Permission } from "../rbac/permission.js";


const router: Router = Router()

router.get("/", listGigsController);
router.get("/:id", getGigDetailsController);
router.post("/create_gig",authenticate,authorizePermission(Permission.CREATE_GIG),createGigController);
router.patch(
  "/:id/deliverables", authenticate, authorizePermission(Permission.UPDATE_GIG), updateGigDeliverablesController);
router.patch(
  "/:id/pricing",
  authenticate,
  authorizePermission(Permission.UPDATE_GIG),
  updateGigPricingController
);
router.post(
  "/:id/publish",
  authenticate,
  authorizePermission(Permission.PUBLISH_GIG),
  publishGigController
);
export default router