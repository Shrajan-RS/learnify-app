import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
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

    message: [{ type: Schema.Types.ObjectId, ref: "UserChat" }],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
