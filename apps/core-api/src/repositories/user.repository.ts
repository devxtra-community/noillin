import { User } from "../models/user.model.js";

class UserRepository {
  async findEmailWithPassword(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    return User.findOne({ email: normalizedEmail }).select("+password");
  }


  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async findById(userId: string) {
    return User.findById(userId).select("+refreshToken");
  }


  async saveRefreshToken(userId: string, refreshToken: string) {
    return User.findByIdAndUpdate(userId, { refreshToken }, { new: true }
    )
  }

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


export const userRepository = new UserRepository()