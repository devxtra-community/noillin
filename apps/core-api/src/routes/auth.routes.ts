import { Router } from "express";

import { loginController, logoutController, refreshTokenController, signupController, verifyEmailController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router: Router = Router()
router.post("/login", loginController)
router.post("/signup", signupController);
router.post("/refresh", refreshTokenController);
router.post("/logout", authenticate, logoutController);
router.get("/verify-email", verifyEmailController);

export default router                   