import { Router } from "express";

import { createGigController, getGigDetailsController, listGigsController } from "../controllers/gig.controller.js";
import { authenticate, authorizePermission } from "../middlewares/auth.middleware.js";
import { Permission } from "../rbac/permission.js";


const router: Router = Router()

router.get("/", listGigsController);
router.get("/:id", getGigDetailsController);
router.post("/create_gig",authenticate,authorizePermission(Permission.CREATE_GIG),createGigController);

export default router