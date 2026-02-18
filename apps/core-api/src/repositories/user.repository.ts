import { User } from "../models/user.model.js";

class UserRepository {

  
  // FIND USER WITH PASSWORD
  
  async findEmailWithPassword(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    return User.findOne({ email: normalizedEmail }).select("+password");
  }

  
  // FIND USER WITH RESET FIELDS
  
  async findByEmailWithResetFields(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    return User.findOne({ email: normalizedEmail })
      .select("+password +resetOtp +resetSessionToken");
  }

  
  // NORMAL FIND BY EMAIL
  
  async findByEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    return User.findOne({ email: normalizedEmail });
  }

  // FIND BY ID
  
  async findById(userId: string) {
    return User.findById(userId).select("+refreshToken");
  }

  
  // SAVE REFRESH TOKEN
  
  async saveRefreshToken(userId: string, refreshToken: string) {
    
    return User.findByIdAndUpdate(
      userId,
      { refreshToken },
      { new: true }
    );
  }

  
  // SAVE RESET OTP
  
  async saveResetOtp(
    userId: string,
    hashedOtp: string,
    expiry: Date
  ) {
    return User.findByIdAndUpdate(
      userId,
      {
        resetOtp: hashedOtp,
        resetOtpExpiry: expiry,
      },
      { new: true }
    );
  }

  
  // SAVE RESET SESSION TOKEN
  
  async saveResetSession(
    userId: string,
    token: string,
    expiry: Date
  ) {
    return User.findByIdAndUpdate(
      userId,
      {
        resetOtp: undefined,
        resetOtpExpiry: undefined,
        resetSessionToken: token,
        resetSessionExpiry: expiry,
      },
      { new: true }
    );
  }

  
  // UPDATE PASSWORD (Production-Safe)
  
  async updatePassword(userId: string, hashedPassword: string) {
    return User.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
        refreshToken: "", //  invalidate all sessions
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  
  // CLEAR RESET SESSION
  
  async clearResetSession(userId: string) {
    return User.findByIdAndUpdate(
      userId,
      {
        resetSessionToken: undefined,
        resetSessionExpiry: undefined,
      },
      { new: true }
    );
  }

  
  // CREATE USER
  
  async create(data: {
    email: string;
    password: string;
    role: string;
    isEmailVerified: boolean;
    status: string;
  }) {
    return User.create(data);
  }
}

export const userRepository = new UserRepository();
