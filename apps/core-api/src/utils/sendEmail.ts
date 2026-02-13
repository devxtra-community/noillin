import nodemailer from "nodemailer";

export const sendEmailVerification = async (
  email: string,
  token: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Account - Marketplace",
    html: `
      <h2>Welcome to Marketplace</h2>
      <p>Click the button below to verify your email:</p>
      <a href="${verificationLink}" 
         style="padding:10px 20px;background:black;color:white;text-decoration:none;">
         Verify Email
      </a>
      <p>This link expires in 20 minutes.</p>
    `,
  });
};
