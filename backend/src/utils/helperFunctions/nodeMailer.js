import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { accountVerificationOTP } from "./mailTemplates.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const sendOTP = async ({ toEmail, OTP, name }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: toEmail,
      subject: "Email Verification",
      html: accountVerificationOTP
        .replace("username", name)
        .replace("{otp}", OTP),
    });
  } catch (error) {
    throw new Error("Error: ", error);
  }
};

export { sendOTP };
