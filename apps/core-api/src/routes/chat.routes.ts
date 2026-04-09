import { Router } from "express";

import { getConversationsController, getChatMessagesController, markAsReadController, } from "../controllers/chat.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router:Router = Router();
router.get("/conversations", authenticate, getConversationsController);

router.get(
  "/:userId",
  authenticate,
  getChatMessagesController
);

router.post(
  "/read/:userId",
  authenticate,
  markAsReadController
);

export default router;