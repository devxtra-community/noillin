import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import { approveSignupController, rejectSignupController } from "../controllers/admin.controllers.js";

const router: Router = Router();

router.post("/signup/approve", authenticate, approveSignupController);
router.post("/signup/reject", authenticate, rejectSignupController);

export default router;
