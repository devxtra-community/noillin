
import crypto from "crypto";

import bcrypt from "bcrypt";

import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../modules/auth/auth.utils.js";
import type { HttpError } from "../modules/auth/http-error.js";
import { userRepository } from "../repositories/user.repository.js"
import { pendingSignupRepository } from "../repositories/Signup.repository.js";
import { logger } from "../utils/logger.js";
import { sendOtpEmail } from "../utils/sendotpEmail.js";




interface SignupInput {
  email: string;
  password: string;
  role: "INFLUENCER" | "BRAND";
  documents: string;
}

export const signupService = async (data: SignupInput) => {
  const existingUser = await userRepository.findEmailWithPassword(data.email);
  if (existingUser) {
    const err: HttpError = new Error("User already exists");
    err.statusCode = 409;
    throw err;
  }

  const existingRequest =
    await pendingSignupRepository.findByEmail(data.email);

  if (existingRequest) {
    const err: HttpError = new Error("Signup request already submitted");
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  // 🔥 1️⃣ Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // 🔥 2️⃣ Hash OTP before saving
  const hashedOtp = await bcrypt.hash(otp, 10);

  // 🔥 3️⃣ Save pending signup with OTP
  await pendingSignupRepository.create({
    email: data.email.toLowerCase(),
    passwordHash,
    role: data.role,
    documents: data.documents,
    status: "PENDING",

    emailOtpHash: hashedOtp,
    emailOtpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
    otpAttempts: 0,
    otpResendCount: 0,
    otpLastSentAt: new Date(),
    isEmailVerified: false,
  });

  // 🔥 4️⃣ Send REAL Gmail OTP
  await sendOtpEmail(data.email, otp);

  return { message: "OTP sent to your email" };
};




interface LoginResult {
  accessToken: string,
  refreshToken: string,
  user: {
    id: string, 
    role: string, 
    adminLevel: string | null
  }
}

export const loginService = async(
  email : string,
  password : string
): Promise<LoginResult> => {
  
  const user = await userRepository.findEmailWithPassword(email)
    logger.info(`EMAIL: ${email}`);

  if (!user) {
    const err: HttpError = new Error("Invalid credentialss")
    err.statusCode = 401
    throw err
  }

  if (user.status !== "ACTIVE") {
    const err: HttpError = new Error("User is not active")
    err.statusCode = 403
    throw err
  }

  if (!user.isEmailVerified) {
    const err: HttpError = new Error("User email is not verified")
    err.statusCode = 403
    throw err
  }


  const isMatch = await bcrypt.compare(password, user.password)
  console.log("PASSWORD FROM DB:", user.password);

  if (!isMatch) {
    const err: HttpError = new Error("Invalid credentials")
    err.statusCode = 401
    throw err
  }

  const payload = {
    userId : user._id.toString(),
    role : user.role,
    adminLevel : user.adminLevel ?? null
  }

  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  await userRepository.saveRefreshToken(user._id.toString(),refreshToken)

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id.toString(),
      role: user.role,
      adminLevel: user.adminLevel ?? null
    }
  }
}


interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}
export const refreshTokenService = async (
  refreshToken: string
): Promise<RefreshResult> => {
  if (!refreshToken) {
    const err: HttpError = new Error("Refresh token required");
    err.statusCode = 400;
    throw err;
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    const err: HttpError = new Error("Invalid refresh token");
    err.statusCode = 401;
    throw err;
  }

  const user = await userRepository.findById(payload.userId);

  //  FIRST check user existence
  if (!user || !user.refreshToken) {
    const err: HttpError = new Error("Refresh token mismatch");
    err.statusCode = 401;
    throw err;
  }


  //  Compare after narrowing
  if (user.refreshToken.trim() !== refreshToken.trim()) {
    const err: HttpError = new Error("Refresh token mismatch");
    err.statusCode = 401;
    throw err;
  }

  const newPayload = {
    userId: user._id.toString(),
    role: user.role,
    adminLevel: user.adminLevel ?? null,
  };

  const newAccessToken = signAccessToken(newPayload);
  const newRefreshToken = signRefreshToken(newPayload);

  await userRepository.saveRefreshToken(user._id.toString(), newRefreshToken);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};


export const logoutService = async (userId: string) => {
  if (!userId) {
    const err: HttpError = new Error("User not authenticated");
    err.statusCode = 401;
    throw err;
  }

  // Invalidate refresh token
  await userRepository.saveRefreshToken(userId, "");

  return { message: "Logged out successfully" };
};


// ================= VERIFY SIGNUP OTP =================
export const verifySignupOtpService = async (
  email: string,
  otp: string
): Promise<void> => {

  const pending = await pendingSignupRepository.findByEmail(email);

  if (!pending) {
    const err: HttpError = new Error("Signup request not found");
    err.statusCode = 404;
    throw err;
  }

  if (pending.isEmailVerified) {
    const err: HttpError = new Error("Email already verified");
    err.statusCode = 400;
    throw err;
  }

  if (!pending.emailOtpHash || !pending.emailOtpExpiresAt) {
    const err: HttpError = new Error("OTP not found");
    err.statusCode = 400;
    throw err;
  }

  if (pending.emailOtpExpiresAt < new Date()) {
    const err: HttpError = new Error("OTP expired");
    err.statusCode = 400;
    throw err;
  }

  const isMatch = await bcrypt.compare(
    otp,
    pending.emailOtpHash
  );

  if (!isMatch) {
    const err: HttpError = new Error("Invalid OTP");
    err.statusCode = 400;
    throw err;
  }

  //  SUCCESS
  pending.isEmailVerified = true;
  pending.emailOtpHash = null;
  pending.emailOtpExpiresAt = null;

  await pending.save();
};



// forgotPasswordService

export const forgotPasswordService = async (email: string) => {
  const user = await userRepository.findEmailWithPassword(email);

  if (!user) return; 

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("RESET OTP:", otp); 

  const hashedOtp = await bcrypt.hash(otp, 10);

  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  await userRepository.saveResetOtp(
    user._id.toString(),
    hashedOtp,
    expiry
  );

  await sendOtpEmail(email, otp);

  logger.info(`Reset OTP sent to ${email}`);
};

// verifyOtpService

export const verifyOtpService = async (
  email: string,
  otp: string
): Promise<string> => {

  const user = await userRepository.findByEmailWithResetFields(email);

  if (!user || !user.resetOtp || !user.resetOtpExpiry) {
    const err: HttpError = new Error("Invalid request");
    err.statusCode = 400;
    throw err;
  }

  if (user.resetOtpExpiry < new Date()) {
    const err: HttpError = new Error("OTP expired");
    err.statusCode = 400;
    throw err;
  }

  const isMatch = await bcrypt.compare(otp, user.resetOtp);

  if (!isMatch) {
    const err: HttpError = new Error("Invalid OTP");
    err.statusCode = 400;
    throw err;
  }

  const resetSessionToken = crypto.randomBytes(32).toString("hex");

  const sessionExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await userRepository.saveResetSession(
    user._id.toString(),
    resetSessionToken,
    sessionExpiry
  );

  return resetSessionToken;
};

// resetPasswordService

export const resetPasswordService = async (
  email: string,
  newPassword: string,
  resetSessionToken: string
) => {

  const user = await userRepository.findByEmailWithResetFields(email);

  if (
    !user ||
    !user.resetSessionToken ||
    !user.resetSessionExpiry
  ) {
    const err: HttpError = new Error("Invalid request");
    err.statusCode = 400;
    throw err;
  }

  if (user.resetSessionToken !== resetSessionToken) {
    const err: HttpError = new Error("Invalid session");
    err.statusCode = 400;
    throw err;
  }

  if (user.resetSessionExpiry < new Date()) {
    const err: HttpError = new Error("Session expired");
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await userRepository.updatePassword(
    user._id.toString(),
    hashedPassword
  );

  await userRepository.clearResetSession(user._id.toString());

  logger.info(`Password reset successful for ${email}`);
};


