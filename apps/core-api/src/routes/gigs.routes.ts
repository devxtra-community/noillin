import { Router } from "express";

import { createGigController, deleteGigController, editGigController, getGigDetailsController, listGigsController } from "../controllers/gig.controller.js";
import { authenticate, authorizePermission } from "../middlewares/auth.middleware.js";
import { Permission } from "../rbac/permission.js";



const router: Router = Router()

router.get("/", listGigsController);
router.get("/:id", getGigDetailsController);
router.post("/create_gig",authenticate,authorizePermission(Permission.CREATE_GIG),createGigController);
router.patch("/:id",authenticate,authorizePermission(Permission.UPDATE_GIG),editGigController);
router.delete("/:id",authenticate,authorizePermission(Permission.DELETE_GIG),deleteGigController);
export default router