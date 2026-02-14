import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import {
  logoutService,
  refreshTokenService,
  loginService,
  signupService,
  forgotPasswordService,
  verifyOtpService,
  resetPasswordService,
} from "../services/auth.service.js";
import type { HttpError } from "../modules/auth/http-error.js";
// import { log } from "winston";


// ================= SIGNUP =================
export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, role, documents: businessInfo } = req.body;

    if (!email || !password || !role) {
      const err: HttpError = new Error("Missing required fields");
      err.statusCode = 400;
      throw err;
    }

    const result = await signupService({
      email,
      password,
      role,
      documents: businessInfo,
    });

    res.status(201).json({
      success: true,
      message: "Signup successful. Please verify your email.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


// ================= LOGIN =================
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err: HttpError = new Error("Email and password required");
      err.statusCode = 400;
      throw err;
    }

    const data = await loginService(email, password);

    // Set refresh token as HttpOnly cookie
    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send only access token and user info in response
    res.status(200).json({
      success: true,
      data: {
        accessToken: data.accessToken,
        user: data.user,
      },
    });
  } catch (error) {
    next(error);
  }
};


// ================= EMAIL VERIFICATION =================
export const verifyEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.query;

    if (!token) {
      const err: HttpError = new Error("Token missing");
      err.statusCode = 400;
      throw err;
    }

    const decoded = jwt.verify(
      token as string,
      process.env.EMAIL_VERIFICATION_SECRET as string
    ) as { userId: string };

    const user = await User.findById(decoded.userId);

    if (!user) {
      const err: HttpError = new Error("Invalid token");
      err.statusCode = 400;
      throw err;
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    user.isEmailVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully. Await admin approval.",
    });
  } catch (error) {
    next(error);
  }
};


// ================= REFRESH TOKEN =================
export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      const err: HttpError = new Error("Refresh token missing");
      err.statusCode = 401;
      throw err;
    }

    const result = await refreshTokenService(refreshToken);

    // Set new refresh token as HttpOnly cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send only access token in response
    res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};


// ================= LOGOUT =================
export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await logoutService(userId);

    // Clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ================= FORGOT PASSWORD =================
export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      const err: HttpError = new Error("Email is required");
      err.statusCode = 400;
      throw err;
    }

    await forgotPasswordService(email);

    res.status(200).json({
      success: true,
      message: "If account exists, OTP sent",
      
    });
   
  } catch (error) {
    next(error);
  }
};

// ================= VERIFY OTP =================
export const verifyOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      const err: HttpError = new Error("Email and OTP required");
      err.statusCode = 400;
      throw err;
    }

    const resetSessionToken = await verifyOtpService(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP verified",
      data: { resetSessionToken },
    });
  } catch (error) {
    next(error);
  }
};

// ================= RESET PASSWORD =================
export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, newPassword, resetSessionToken } = req.body;

    if (!email || !newPassword || !resetSessionToken) {
      const err: HttpError = new Error("Missing required fields");
      err.statusCode = 400;
      throw err;
    }

    await resetPasswordService(email, newPassword, resetSessionToken);

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};



