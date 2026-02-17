import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import {
  getMyProfileController,
  updateProfileController
} from "../controllers/profile.controller.js";

const router: Router = Router();

router.get("/get_profile", authenticate, getMyProfileController);
router.patch("/update_profile", authenticate, updateProfileController);

export default router;
