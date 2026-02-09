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

import { signAccessToken, signRefreshToken } from "../modules/auth/auth.utils.js";
import type { HttpError } from "../modules/auth/http-error.js";
import { userRepository } from "../repositories/user.repository.js"


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
  if (!user) {
    const err: HttpError = new Error("Invalid credentials")
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