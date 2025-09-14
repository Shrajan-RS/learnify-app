import crypto from "crypto";

import { User } from "../models/user.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

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

const login = asyncHandler(async (req, res) => {});

const logout = asyncHandler(async (req, res) => {});

export { signup, verification, login, logout };
