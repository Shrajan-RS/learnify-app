import crypto from "crypto";
import bcryptjs from "bcryptjs";

import { User } from "../models/user.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import generateJWTToken from "../utils/helperFunctions/generateJWTToken.js";
import {
  loginValidator,
  signupValidator,
} from "../utils/helperFunctions/validator.js";
import { sendOTP } from "../utils/helperFunctions/nodeMailer.js";

const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const errorMessage = signupValidator(name, email, password);

  if (errorMessage) res.status(400).json(new ApiError(400, errorMessage));

  const userExist = await User.findOne({ email });
  if (userExist) throw new ApiError(409, "This email is taken!");

  const verificationToken = crypto.randomInt(100000, 1000000).toString();

  const hashedPassword = await bcryptjs.hash(
    password,
    Number(process.env.SALT_ROUNDS)
  );

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    verificationToken,
    verificationTokenExpires: Date.now() + 10 * 60 * 1000,
  });

  sendOTP({ toEmail: newUser.email, OTP: verificationToken, name });

  res.status(201).json(new ApiResponse(201, "User Created Successfully!"));
});

const verification = asyncHandler(async (req, res) => {
  const { email, OTP } = req.body;

  if (!email || email.trim() === "")
    throw new ApiError(400, "Please Enter Email!");
  if (!OTP || OTP.trim() === "") throw new ApiError(400, "Please Enter OTP!");

  const user = await User.findOne({
    email,
  });

  if (!user) throw new ApiError(404, "User Not Found!");

  if (OTP !== user.verificationToken) throw new ApiError(400, "Invalid OTP!");

  if (user.verificationTokenExpires < Date.now())
    throw new ApiError(400, "Expired OTP!");

  user.isVerified = true;
  user.verificationToken = null;
  user.verificationTokenExpires = null;

  res.status(200).json(
    new ApiResponse(200, "Email Verified Successfully!", {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    })
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const errorMessage = loginValidator(email, password);

  if (errorMessage) throw new ApiError(400, errorMessage);

  const user = await User.findOne({ email });

  if (!user) throw new ApiError(404, "User Not Found!");

  if (!user.password)
    throw new ApiError(
      400,
      "This account was created using google authentication , login with google authentication!"
    );

  if (!user.isVerified)
    throw new ApiError(400, "Unauthorized Access, verify the email!");

  const isPasswordMatch = await bcryptjs.compare(password, user.password);

  if (!isPasswordMatch) throw new ApiError(401, "Invalid Credentials!");

  const token = generateJWTToken({
    id: user._id,
    name: user.name,
    role: user.role,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || false,
    sameSite: "strict",
    maxAge: 1 * 60 * 60 * 1000,
  });

  res.status(200).json(
    new ApiResponse(200, "User Logged In Successfully!", {
      id: user._id,
      name: user.name,
      token: token,
    })
  );
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json(new ApiResponse(200, "Logged Out Successfully!"));
});

const googleSignUp = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if ([name, email].some((field) => !field || field.trim() === "")) {
    throw new ApiError(500, "Something Went Wrong, Try Again Later!");
  }

  const useExist = await User.findOne({ email });

  if (useExist)
    throw new ApiError(407, "User Already Exist, Go To Login Page!");

  const newUser = await User.create({
    name,
    email,
    isVerified: true,
  });

  res
    .status(201)
    .json(new ApiResponse(201, "User Created Successfully!", newUser));
});

const googleLogin = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) throw new ApiError(404, "User not found!");

  if (!user.isVerified) throw new ApiError(400, "This email is not verified!");

  const token = generateJWTToken({
    id: user._id,
    name: user.name,
    role: user.role,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || false,
    sameSite: "strict",
    maxAge: 1 * 60 * 60 * 1000,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "User Logged In Successfully!", user));
});

export { signup, googleSignUp, verification, login, googleLogin, logout };
