
import crypto from "crypto";

import bcrypt from "bcrypt";

import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../modules/auth/auth.utils.js";
import { createHttpError } from "../modules/auth/http-error.js";
import { userRepository } from "../repositories/user.repository.js"
import { pendingSignupRepository } from "../repositories/Signup.repository.js";
import { logger } from "../utils/logger.js";
import { sendOtpEmail } from "../utils/sendotpEmail.js";





interface SignupInput {
  fullName: string;
  email: string;
  password: string;
  role: "INFLUENCER" | "BRAND";
  documents?: string;
}

export const signupService = async (data: SignupInput) => {
  const existingUser = await userRepository.findEmailWithPassword(data.email);
  if (existingUser) {
    throw createHttpError("User already exists", 409);
  }

  const existingRequest =
    await pendingSignupRepository.findByEmail(data.email);

  if (existingRequest) {
    throw createHttpError("Sign up request already submitted", 409);
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  //  Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();


  //  Hash OTP before saving
  const hashedOtp = await bcrypt.hash(otp, 10);

  //  Save pending signup with OTP
  await pendingSignupRepository.create({
    fullName: data.fullName,
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

  //  Send REAL Gmail OTP
  await sendOtpEmail(data.email, otp);

  return { 
    message: "OTP sent to your email",
    email: data.email,
    role: data.role
  };
  
};




interface LoginResult {
  accessToken: string,
  refreshToken: string,
  user: {
    id: string,
    email: string,
    role: string,
    adminLevel: string | null
  }
}

export const loginService = async (
  email: string,
  password: string
): Promise<LoginResult> => {

  const user = await userRepository.findEmailWithPassword(email)
  logger.info(`EMAIL: ${email}`);

  if (!user) {
    throw createHttpError("Invalid credentials", 401);
  }

  if (user.status !== "ACTIVE") {
    throw createHttpError("User is not active", 401);
  }

  if (!user.isEmailVerified) {
    throw createHttpError("User email is not verified", 401);
  }


  const isMatch = await bcrypt.compare(password, user.password)
  console.log("PASSWORD FROM DB:", user.password);

  if (!isMatch) {
    throw createHttpError("Invalid credentials", 401);
  }

  const payload = {
    userId: user._id.toString(),
    role: user.role,
    adminLevel: user.adminLevel ?? null
  }

  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  await userRepository.saveRefreshToken(user._id.toString(), refreshToken)

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      adminLevel: user.adminLevel ?? null
    }
  }
}


// interface RefreshResult {
//   accessToken: string;
//   refreshToken: string;
// }
// export const refreshTokenService = async (
//   refreshToken: string
// ): Promise<RefreshResult> => {
//   if (!refreshToken) {
//     const err: HttpError = new Error("Refresh token required");
//     err.statusCode = 400;
//     throw err;
//   }

//   let payload;
//   try {
//     payload = verifyRefreshToken(refreshToken);
//   } catch {
//     const err: HttpError = new Error("Invalid refresh token");
//     err.statusCode = 401;
//     throw err;
//   }

//   const user = await userRepository.findById(payload.userId);

//   if (!user || !user.refreshToken) {
//     const err: HttpError = new Error("Refresh token mismatch");
//     err.statusCode = 401;
//     throw err;
//   }


//   if (user.refreshToken.trim() !== refreshToken.trim()) {
//     const err: HttpError = new Error("Refresh token mismatch");
//     err.statusCode = 401;
//     throw err;
//   }

//   const newPayload = {
//     userId: user._id.toString(),
//     role: user.role,
//     adminLevel: user.adminLevel ?? null,
//   };

//   const newAccessToken = signAccessToken(newPayload);
//   const newRefreshToken = signRefreshToken(newPayload);

//   await userRepository.saveRefreshToken(user._id.toString(), newRefreshToken);

//   return {
//     accessToken: newAccessToken,
//     refreshToken: newRefreshToken,
//     user: {
//       id: user._id.toString(),
//       email: user.email,
//       role: user.role,
//       adminLevel: user.adminLevel ?? null,
//     },
//   };
// };

interface RefreshResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    adminLevel: string | null;
  };
}

export const refreshTokenService = async (
  refreshToken: string
): Promise<RefreshResult> => {
  if (!refreshToken) {

    throw createHttpError("Refresh token required", 401);
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {

    throw createHttpError("Invalid refresh token", 401);
  }

  const user = await userRepository.findById(payload.userId);

  //  FIRST check user existence
  if (!user || !user.refreshToken) {

    throw createHttpError("Refresh token mismatch", 401);
  }


  //  Compare after narrowing
  if (user.refreshToken.trim() !== refreshToken.trim()) {

    throw createHttpError("Refresh token mismatch", 401);
  }

  const newPayload = {
    userId: user._id.toString(),
    role: user.role,
    adminLevel: user.adminLevel ?? null,
  };

  const newAccessToken = signAccessToken(newPayload);
  const newRefreshToken = signRefreshToken(newPayload);

  await userRepository.saveRefreshToken(
    user._id.toString(),
    newRefreshToken
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      adminLevel: user.adminLevel ?? null,
    },
  };
};


export const logoutService = async (userId: string) => {
  if (!userId) {

    throw createHttpError("User not authenticated", 401);
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

    throw createHttpError("Signup request not found", 409);
  }

  if (pending.isEmailVerified) {

    throw createHttpError("Email already verified", 409);
  }

  if (!pending.emailOtpHash || !pending.emailOtpExpiresAt) {

    throw createHttpError("OTP not found", 409);
  }

  if (pending.emailOtpExpiresAt < new Date()) {

    throw createHttpError("OTP expired", 409);
  }

  const isMatch = await bcrypt.compare(
    otp,
    pending.emailOtpHash
  );

  if (!isMatch) {

    throw createHttpError("Invalid OTP", 409);
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

    throw createHttpError("Invalid request", 409);
  }

  if (user.resetOtpExpiry < new Date()) {

    throw createHttpError("OTP expired", 409);
  }

  const isMatch = await bcrypt.compare(otp, user.resetOtp);

  if (!isMatch) {

    throw createHttpError("Invalid OTP", 409);
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

    throw createHttpError("Invalid request", 409);
  }

  if (user.resetSessionToken !== resetSessionToken) {

    throw createHttpError("Invalid session", 409);
  }

  if (user.resetSessionExpiry < new Date()) {

    throw createHttpError("Session expired", 409);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await userRepository.updatePassword(
    user._id.toString(),
    hashedPassword
  );

  await userRepository.clearResetSession(user._id.toString());

  logger.info(`Password reset successful for ${email}`);
};


export const pendingProfileService = async (email: string, profileData: Record<string, unknown>) => {
  const pending = await pendingSignupRepository.findByEmail(email);

  if (!pending) {
    throw createHttpError("Signup request not found", 404);
  }

  pending.profileData = profileData;
  await pending.save();

  return { message: "Profile data saved successfully" };
};

