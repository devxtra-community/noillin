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
  verifySignupOtpService,
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

// ================= VERIFY SIGNUP OTP =================
export const verifySignupOtpController = async (
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

    await verifySignupOtpService(email, otp);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
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
export const verifyResetOtpController = async (
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

// ================= listGigsController  =================

// export const listGigsController = async (req: Request, res: Response) => {
//   try {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;

//     const result = await listGigsService(req.query, page, limit);

//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Error listing gigs:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


