import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import {
  approveSignupController,
  getAllpendingSignupController,
  rejectSignupController,
} from "../controllers/admin.controller.js";

const router: Router = Router();

router.get("/signup", getAllpendingSignupController);
router.post("/signup/approve", authenticate, approveSignupController);
router.post("/signup/reject", authenticate, rejectSignupController);

export default router;