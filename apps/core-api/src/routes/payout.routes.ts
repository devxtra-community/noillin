import { Router } from "express";

import { withdrawBalance } from "../controllers/payout.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router: Router = Router();

// 🔥 Withdraw FULL available balance
router.post("/withdraw", authenticate, withdrawBalance);

export default router;
