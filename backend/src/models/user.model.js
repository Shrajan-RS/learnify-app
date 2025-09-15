import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import { type } from "os";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minLength: [3, "User Name Must At Least 3 Characters Long!"],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },

    password: {
      type: String,
      required: true,
      minLength: [6, "Password must be at least 6 characters long!"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    role: {
      type: String,
      enum: ["student", "lecturer"],
      default: "student",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 13;

    this.password = await bcryptjs.hash(this.password, SALT_ROUNDS);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return bcryptjs.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
