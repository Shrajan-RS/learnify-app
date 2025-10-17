import crypto from "crypto";

import { User } from "../models/user.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import generateJWTToken from "../utils/helperFunctions/generateJWTToken.js";

const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "All Fields Must Be Filled!");
  }

  const userExist = await User.findOne({ email });
  if (userExist) throw new ApiError(409, "User Already Exist!");

  const verificationToken = crypto.randomInt(100000, 1000000).toString();

  const newUser = new User({
    name,
    email,
    password,
    verificationToken,
    verificationTokenExpires: Date.now() + 10 * 60 * 1000,
  });

  await newUser.save();

  // sendVerificationOTP({
  //   name: newUser.name,
  //   email: newUser.email,
  //   OTP: newUser.verificationToken,
  // });

  res.status(201).json(
    new ApiResponse(201, "User Created Successfully!", {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isVerified: newUser.isVerified,
    })
  );
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

  await user.save();

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

  if ([email, password].some((field) => !field || field.trim() === ""))
    throw new ApiError(400, "All Fields Must Be Filled!");

  const user = await User.findOne({ email });

  if (!user) throw new ApiError(404, "User Not Found!");

  if (!user.isVerified)
    throw new ApiError(400, "Create An Account Before Logging!");

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) throw new ApiError(401, "Invalid Credentials!");

  const token = generateJWTToken({
    id: user._id,
    name: user.name,
    role: user.role,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
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

export { signup, verification, login, logout };
