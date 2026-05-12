import { Router } from "express";

import { GigRequestController } from "../controllers/gig-request.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router: Router = Router();
const controller = new GigRequestController();

// Brand sends a gig request
router.post("/request", authenticate, controller.sendRequest.bind(controller));
// Influencer accepts
router.patch("/:id/accept", authenticate, controller.accept.bind(controller));
// Influencer rejects
router.patch("/:id/reject", authenticate, controller.reject.bind(controller));
// Get all my requests (brand sees outgoing, influencer sees incoming)
router.get("/my", authenticate, controller.myRequests.bind(controller));
// Get a single request by ID
router.get("/details/:id", authenticate, controller.getById.bind(controller));

export default router;
