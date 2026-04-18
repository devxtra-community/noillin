import { Router } from "express";

import { createReportController } from "../controllers/report.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router: Router = Router();

router.post("/", authenticate, createReportController);

export default router;