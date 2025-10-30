import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const getCurrentUser = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id);

  res.status(200).json(user);
});

export { getCurrentUser };
