import { Router } from "express";

import { forgotPasswordController, loginController, logoutController, pendingProfileController, refreshTokenController, resendSignupOtpController, resetPasswordController, signupController, verifyResetOtpController, verifySignupOtpController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const router: Router = Router()
router.post("/login", authLimiter, loginController)
router.post("/signup", authLimiter, signupController);
router.post("/refresh", refreshTokenController);
router.post("/logout", authenticate, logoutController);
router.post("/verify-signup-otp", authLimiter, verifySignupOtpController);
router.post("/resend-signup-otp", authLimiter, resendSignupOtpController);
router.post("/forgot-password", authLimiter, forgotPasswordController);
router.post("/verify-reset-otp", authLimiter, verifyResetOtpController);
router.post("/reset-password", authLimiter, resetPasswordController);
router.post("/pending-profile", pendingProfileController);


export default router                   
