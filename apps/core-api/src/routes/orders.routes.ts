import { Router } from "express";

import { approveWork, markCompleted, rejectWork, releasePayment, getOrderDetails, createOrder, getHistory, getOrderBySession, cancelOrder } from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router: Router = Router();

router.post("/", authenticate, createOrder);
router.get("/history", authenticate, getHistory);
router.get("/by-session/:sessionId", authenticate, getOrderBySession);
router.get("/details/:id", authenticate, getOrderDetails);

router.patch("/release/:id", authenticate, releasePayment);
router.patch("/submit/:id", authenticate, markCompleted);
router.patch("/approve/:id", authenticate, approveWork);
router.patch("/reject/:id", authenticate, rejectWork);
router.patch("/cancel/:id", authenticate, cancelOrder);

export default router;