import express from "express";

import { User } from "../models/user.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const signup = asyncHandler(async (req, res) => {});
const verification = asyncHandler(async (req, res) => {});
const login = asyncHandler(async (req, res) => {});
const logout = asyncHandler(async (req, res) => {});

export { signup, verification, login, logout };
