import { Router } from "express";

import { NotificationController } from "../controllers/notification.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router: Router = Router();
const controller = new NotificationController();

router.post("/subscriptions", authenticate, controller.saveSubscription.bind(controller));
router.delete("/subscriptions", authenticate, controller.removeSubscription.bind(controller));
router.get("/my", authenticate, controller.getMyNotifications.bind(controller));
router.patch("/:id/read", authenticate, controller.markAsRead.bind(controller));
router.patch("/read-all", authenticate, controller.markAllAsRead.bind(controller));

export default router;
