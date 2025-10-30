import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    userPromptType: { type: String, required: true },
    userPrompt: { type: String, required: true },
    aiResponse: { type: String, required: true },
  },
  { timestamps: true }
);

const userChatSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    messages: [messageSchema],
  },
  { timestamps: true }
);

export const UserChat = mongoose.model("UserChat", userChatSchema);
