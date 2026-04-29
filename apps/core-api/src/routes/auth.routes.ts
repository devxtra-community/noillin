import { Router } from "express";

import { forgotPasswordController, loginController, logoutController, refreshTokenController, resetPasswordController, signupController, verifyResetOtpController, verifySignupOtpController, pendingProfileController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router: Router = Router()
router.post("/login", loginController)
router.post("/signup", signupController);
router.post("/refresh", refreshTokenController);
router.post("/logout", authenticate, logoutController);
router.post("/verify-signup-otp", verifySignupOtpController);
router.post("/forgot-password", forgotPasswordController);
router.post("/verify-reset-otp", verifyResetOtpController);
router.post("/reset-password", resetPasswordController);
router.post("/pending-profile", pendingProfileController);


export default router                   