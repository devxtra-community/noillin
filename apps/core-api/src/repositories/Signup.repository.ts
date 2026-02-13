import { PendingSignup } from "../models/pendingSignup.models.js";


interface CreatePendingSignupInput {
  email: string;
  passwordHash: string;
  documents: string;
  role: "INFLUENCER" | "BRAND";

  status: "PENDING" | "APPROVED" | "REJECTED";

  // 🔐 OTP fields (optional)
  emailOtpHash?: string | null;
  emailOtpExpiresAt?: Date | null;
  otpAttempts?: number;
  otpResendCount?: number;
  otpLastSentAt?: Date | null;
  otpLockedUntil?: Date | null;
  isEmailVerified?: boolean;
}

class PendingSignupRepository {
  // ================= CREATE =================
  create(data: CreatePendingSignupInput) {
    return PendingSignup.create(data);
  }

  // ================= FIND =================
  findByEmail(email: string) {
    return PendingSignup.findOne({ email });
  }

  // ================= UPDATE STATUS =================
  updateStatus(email: string, status: "APPROVED" | "REJECTED") {
    return PendingSignup.findOneAndUpdate(
      { email },
      { status },
      { new: true }
    );
  }

  // ================= DELETE ONE =================
  deleteByEmail(email: string) {
    return PendingSignup.findOneAndDelete({ email });
  }

  // ================= DELETE MANY (FOR CLEANUP) =================
 deleteMany(filter: Record<string, unknown>): Promise<unknown> {
  return PendingSignup.deleteMany(filter);
}

}

export const pendingSignupRepository =
  new PendingSignupRepository();
