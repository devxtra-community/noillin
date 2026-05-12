import { Router } from "express";

import {
  createCheckout,
  stripeWebhook,
  createStripeAccountLink,
} from "../controllers/payment.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router: Router = Router();

router.post("/checkout", createCheckout);
router.post("/connect", authenticate, createStripeAccountLink);
router.post("/webhook", stripeWebhook);

export default router;