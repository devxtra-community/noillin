import { Router } from "express";

import { ConnectionController } from "../controllers/connection.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router: Router = Router();
const controller = new ConnectionController();

router.post("/request", authenticate, controller.sendRequest);
router.patch("/:id/accept", authenticate, controller.accept);
router.patch("/:id/reject", authenticate, controller.reject);
router.get("/my", authenticate, controller.myConnections);

export default router;