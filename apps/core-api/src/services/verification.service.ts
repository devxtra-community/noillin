import bcrypt from "bcrypt";

import type { HttpError } from "../modules/auth/http-error.js";
import { pendingSignupRepository } from "../repositories/Signup.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import { profileRepository } from "../repositories/profile.repository.js";
import type { PendingSignupFilter, PendingSignupQuery } from "../types/pendingSignup.types.js";

// ================= VERIFY OTP =================
export const verifyOtpService = async (
  email: string,
  otp: string
) => {
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

  const now = new Date();

  // 🔒 Lock check
  if (pending.otpLockedUntil && pending.otpLockedUntil > now) {
    const err: HttpError = new Error("Too many attempts. Try again later.");
    err.statusCode = 403;
    throw err;
  }

  // ⏳ Expiry check
  if (!pending.emailOtpExpiresAt || pending.emailOtpExpiresAt < now) {
    const err: HttpError = new Error("OTP expired");
    err.statusCode = 400;
    throw err;
  }

  const isMatch = await bcrypt.compare(
    otp,
    pending.emailOtpHash as string
  );

  if (!isMatch) {
    pending.otpAttempts = (pending.otpAttempts || 0) + 1;

    if (pending.otpAttempts >= 5) {
      pending.otpLockedUntil = new Date(
        now.getTime() + 15 * 60 * 1000 // lock for 15 minutes
      );
    }

    await pending.save();

    const err: HttpError = new Error("Invalid OTP");
    err.statusCode = 401;
    throw err;
  }

  // ✅ SUCCESS
  pending.isEmailVerified = true;
  pending.emailOtpHash = null;
  pending.emailOtpExpiresAt = null;
  pending.otpAttempts = 0;
  pending.otpLockedUntil = null;

  await pending.save();

  return { message: "Email verified successfully" };
};

// ================= RESEND OTP =================
export const resendOtpService = async (email: string) => {
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

  const now = new Date();

  // ⏳ Cooldown check (60 seconds)
  if (
    pending.otpLastSentAt &&
    now.getTime() - pending.otpLastSentAt.getTime() < 60 * 1000
  ) {
    const err: HttpError = new Error("Please wait before requesting another OTP");
    err.statusCode = 429;
    throw err;
  }

  // 🔁 Max resend limit
  if ((pending.otpResendCount || 0) >= 5) {
    const err: HttpError = new Error("Maximum resend attempts reached");
    err.statusCode = 403;
    throw err;
  }

  // 🔐 Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);

  pending.emailOtpHash = hashedOtp;
  pending.emailOtpExpiresAt = new Date(now.getTime() + 5 * 60 * 1000);
  pending.otpResendCount = (pending.otpResendCount || 0) + 1;
  pending.otpLastSentAt = now;

  await pending.save();

  // TODO: Send OTP email here
  // await sendOtpEmail(email, otp);

  return { message: "OTP resent successfully" };
};

// ================= APPROVE SIGNUP =================
export const approveSignupService = async (email: string) => {
  const pending = await pendingSignupRepository.findByEmail(email);

  if (!pending) {
    const err: HttpError = new Error("Pending signup not found");
    err.statusCode = 404;
    throw err;
  }

  if (pending.status !== "PENDING") {
    const err: HttpError = new Error("Signup already processed");
    err.statusCode = 400;
    throw err;
  }

  // Check if user already exists
  const existingUser = await userRepository.findByEmail(pending.email);
  if (existingUser) {
    const err: HttpError = new Error("User with this email already exists");
    err.statusCode = 409;
    throw err;
  }

  const user = await userRepository.create({
    email: pending.email,
    password: pending.passwordHash,
    role: pending.role,
    // @ts-expect-error - adminLevel not in user create type yet
    adminLevel: pending.adminLevel || null,
    isEmailVerified: true,
    status: "ACTIVE",
  });

  if (user.role === "INFLUENCER") {
    await profileRepository.createInfluencer({
      userId: user._id,
      fullName: "",
      username: user.email?.split("@")[0] || user.email,
      categories: [],
      languages: [],
      isProfileComplete: false,
      isVerified: false,
    });
  }

  if (user.role === "BRAND") {
    await profileRepository.createBrand({
      userId: user._id,
      companyName: "Pending Setup",
      industry: "Not Specified",
      contactPersonName: user.email?.split("@")[0] || "Pending",
      contactEmail: user.email,
      documents: [],
      isProfileComplete: false,
      isVerified: false,
    });
  }


  await pendingSignupRepository.updateStatus(email, "APPROVED");

  return { message: "Signup approved successfully" };
};

// ================= REJECT SIGNUP =================
export const rejectSignupService = async (
  email: string,
  _reason?: string
) => {
  const pending = await pendingSignupRepository.findByEmail(email);

  if (!pending) {
    const err: HttpError = new Error("Pending signup not found");
    err.statusCode = 404;
    throw err;
  }

  await pendingSignupRepository.updateStatus(email, "REJECTED");

  return { message: "Signup rejected successfully" };
};

export const cleanupExpiredSignups = async () => {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

  await pendingSignupRepository.deleteMany({
    isEmailVerified: false,
    createdAt: { $lt: cutoff },
  });
};


export const getAllPendingSignupService = async (query: PendingSignupQuery = {}) => {
  const { search, role, status = "PENDING" } = query;
  const filter: PendingSignupFilter = { status };

  if (role) {
    filter.role = role.toUpperCase();
  }

  if (search) {
    filter.$or = [
      { email: { $regex: search, $options: "i" } },
      { documents: { $regex: search, $options: "i" } },
    ];
  }

  return pendingSignupRepository.getAllPendingSignups(filter);
};