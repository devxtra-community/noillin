import { Router } from "express";

import { getConversationsController, getChatMessagesController, markAsReadController, sendMessageController, respondToProposalController, getAgreedProposalsController } from "../controllers/chat.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router: Router = Router();
router.get("/conversations", authenticate, getConversationsController);
router.get("/agreed-proposals", authenticate, getAgreedProposalsController);
router.post("/send", authenticate, sendMessageController);

router.get(
  "/:gigRequestId",
  authenticate,
  getChatMessagesController
);

router.post(
  "/read/:gigRequestId",
  authenticate,
  markAsReadController
);

router.patch(
  "/proposal-respond/:messageId",
  authenticate,
  respondToProposalController
);

export default router;