import { User } from "../models/user.model.js";
import generateGeminiResponse from "../services/gemini.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { UserChat } from "../models/user.chat.model.js";

const getCurrentUser = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id);

  res.status(200).json(user);
});

const summarize = asyncHandler(async (req, res) => {
  const { content, option } = req.body;

  const { id } = req.user;

  const customSummarizePrompt = `
  Summarize the following user-provided content. 

Your goal:
- Give a small 1 liner title for the content with a key like "title:"
- Give a key at the beginning of the main content like "content:"
-Do not include any "* or #" in the title or the content
- Extract and organize the main ideas.
- Remove redundancy, tangents, and filler.
- Keep it factually accurate and neutral in tone.
- Adjust summary length based on how detailed the original text is.
- Preserve any structure (like steps, arguments, or conclusions) if relevant.
-If the content have any unwanted bullet points or whitespaces remove it.

Content:
${content}
  `;

  const geminiResponse = await generateGeminiResponse(customSummarizePrompt);

  const [titlePart, contentPart] = geminiResponse.text.split("content:");

  const title = titlePart.replace("title:", "").trim(" ");
  const aiResponse = contentPart.replaceAll("*", "");

  console.log(aiResponse);

  const message = await UserChat.create({
    user: id,
    messages: [
      {
        userPromptType: option,
        userPromptTitle: title,
        userPrompt: content,
        aiResponse,
      },
    ],
  });

  await User.findByIdAndUpdate(
    id,
    { $push: { message: message._id } },
    { new: true }
  );

  res.status(200).json(new ApiResponse(200, "success", message.messages));
});

export { getCurrentUser, summarize };
