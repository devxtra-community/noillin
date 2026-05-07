import { Router } from "express";

import { getDashboardCounts } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router: Router = Router();

router.get("/counts", authenticate, getDashboardCounts);

export default router;