import { Router } from "express";

import { approveWork, markCompleted, releasePayment, getOrderDetails, createOrder, getHistory, getOrderBySession } from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router: Router = Router();

router.post("/", authenticate, createOrder);
router.get("/history", authenticate, getHistory);
router.get("/by-session/:sessionId", authenticate, getOrderBySession);
router.get("/details/:id", authenticate, getOrderDetails);

router.patch("/release/:id", authenticate, releasePayment);
router.patch("/submit/:id", authenticate, markCompleted);
router.patch("/approve/:id", authenticate, approveWork);

export default router;