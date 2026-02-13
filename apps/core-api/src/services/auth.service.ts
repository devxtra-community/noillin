// class AuthService {
//   async loginUser(_email: string, _password: string) {
//     // find user
//     // compare password
//     // create tokens
//     // save refresh token
//     // return tokens
//   }


//   async refreshSession(_token: string) {
//     // verify refresh token
//     // issue new access token
//   }
// }

// export const authService = new AuthService();
import bcrypt from "bcrypt";

import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../modules/auth/auth.utils.js";
import type { HttpError } from "../modules/auth/http-error.js";
import { userRepository } from "../repositories/user.repository.js"
import { pendingSignupRepository } from "../repositories/Signup.repository.js";
import { logger } from "../utils/logger.js";


interface SignupInput {
  email: string;
  password: string;
  role: "INFLUENCER" | "BRAND";
  documents: string[];
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

  await pendingSignupRepository.create({
    email: data.email.toLowerCase(),
    passwordHash,
    role: data.role,
    documents: data.documents,
    status: "PENDING",
  });

  return { message: "Signup request submitted for review" };
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

  if (!user || !user.refreshToken) {
    const err: HttpError = new Error("Refresh token mismatch");
    err.statusCode = 401;
    throw err;
  }


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

  await userRepository.saveRefreshToken(userId, "");

  return { message: "Logged out successfully" };
};
