import { PendingSignup } from "../models/pendingSignup.models.js";

interface CreatePendingSignupInput {
  email: string;
  role: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  passwordHash: string;
  documents: string[];


}

class PendingSignupRepository {
  create(data: CreatePendingSignupInput) {
    return PendingSignup.create(data);
  }

  findByEmail(email: string) {
    return PendingSignup.findOne({ email });
  }
  
  updateStatus(email: string, status: "APPROVED" | "REJECTED") {
    return PendingSignup.findOneAndUpdate(
      { email },
      { status },
      { new: true }
    );
  }

  deleteByEmail(email: string) {
    return PendingSignup.findOneAndDelete({ email });
  }
}

export const pendingSignupRepository =
  new PendingSignupRepository();
