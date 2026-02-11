import jwt from "jsonwebtoken";

export const generateEmailVerificationToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.EMAIL_VERIFICATION_SECRET as string,
    { expiresIn: "20m" }
  );
};
