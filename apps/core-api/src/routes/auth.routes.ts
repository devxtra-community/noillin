import { Router } from "express";

import { forgotPasswordController, loginController, logoutController, refreshTokenController, resetPasswordController, signupController, verifyEmailController, verifyOtpController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router: Router = Router()
router.post("/login", loginController)
router.post("/signup", signupController);
router.post("/refresh", refreshTokenController);
router.post("/logout", authenticate, logoutController);
router.get("/verify-email", verifyEmailController);
router.post("/forgot-password", forgotPasswordController);
router.post("/verify-otp", verifyOtpController);
router.post("/reset-password", resetPasswordController);


export default router                   