import type { HttpError } from "../modules/auth/http-error.js";
import { pendingSignupRepository } from "../repositories/Signup.repository.js";
import { userRepository } from "../repositories/user.repository.js";
// import { sendMail } from "../../utils/nodemailer";

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


  await userRepository.create({
    email: pending.email,
    password: pending.passwordHash,
    role: pending.role,
    isEmailVerified: true,
    status: "ACTIVE",
  });

  await pendingSignupRepository.deleteByEmail(email);

  // await sendMail(
  //   email,
  //   "Signup Approved",
  //   "Your account has been approved. You can now log in."
  // );

  return { message: "Signup approved successfully" };
};

export const rejectSignupService = async (
  email: string,
  reason?: string
) => {
  const pending = await pendingSignupRepository.findByEmail(email);

  if (!pending) {
    const err: HttpError = new Error("Pending signup not found");
    err.statusCode = 404;
    throw err;
  }

  await pendingSignupRepository.deleteByEmail(email);

  // await sendMail(
  //   email,
  //   "Signup Rejected",
  //   reason ?? "Your signup request was rejected by the admin."
  // );

  return { message: "Signup rejected successfully" };
};
