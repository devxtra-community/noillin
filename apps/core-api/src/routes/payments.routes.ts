import { Router } from "express";

import {
  createCheckout,
  stripeWebhook,
} from "../controllers/payment.controller.js";

const router = Router();

router.post("/checkout", createCheckout);
router.post("/webhook", stripeWebhook);

export default router;