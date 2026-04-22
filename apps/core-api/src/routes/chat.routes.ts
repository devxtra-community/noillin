import { Router } from "express";

import { getConversationsController, getChatMessagesController, markAsReadController, sendMessageController } from "../controllers/chat.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router:Router = Router();
router.get("/conversations", authenticate, getConversationsController);
router.post("/send", authenticate, sendMessageController);

router.get(
  "/:connectionId",
  authenticate,
  getChatMessagesController
);

router.post(
  "/read/:connectionId",
  authenticate,
  markAsReadController
);

export default router;