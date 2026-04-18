import { Router } from "express";

import { authenticate, authorizePermission } from "../middlewares/auth.middleware.js";
import { Permission } from "../rbac/permission.js";
import { createGigController, deleteGigController, editGigController, getGigDetailsController, listGigsController, publishGigController,  updateGigDeliverablesController, updateGigPricingController } from "../controllers/gig.controller.js";



const router: Router = Router()


router.get("/", listGigsController);
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
router.patch("/:id",authenticate,authorizePermission(Permission.UPDATE_GIG),editGigController);
router.delete("/:id",authenticate,authorizePermission(Permission.DELETE_GIG),deleteGigController);
router.get("/:id", getGigDetailsController);

export default router