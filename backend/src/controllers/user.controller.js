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
You are a precise summarization model.

Your task:

* Read the following user-provided content carefully.
* Generate a short and relevant 1-line title for the content. Start with: "title: <your title here>"
* Then summarize the content clearly under the key "content:".
* Under "content:", present the summary in clean, concise points that each start with "*".
* Focus on the core ideas, main arguments, and logical flow.
* Remove redundant phrases, tangents, or filler words.
* Keep the summary factually accurate, neutral, and well-organized.
* Preserve structure if the original text includes steps, arguments, or conclusions.
* Do not include any markdown symbols or formatting.
* Make sure the title and points are contextually relevant to the content.

Content: ${content}
  `;

  const geminiResponse = await generateGeminiResponse(customSummarizePrompt);

  console.log(geminiResponse?.text);

  const [titlePart, contentPart] = geminiResponse.text.split("content:");

  const title = titlePart.replace("title:", "").trim(" ");
  const aiResponse = contentPart;

  console.log("title: ", title);
  console.log("content: ", aiResponse);

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

const flashCard = asyncHandler(async (req, res) => {
  const { content, option } = req.body;

  const { id } = req.user;

  const customFlashcardPrompt = `
  I want you to act as an expert flashcard creator.
Your goal is to generate high-quality, concise, and easy-to-memorize flashcards from the text I'll provide.

✅ Instructions:

-Each flashcard must have a Question (Q) and Answer (A).

-Questions should focus on key concepts, definitions, causes, effects, examples, and implications.

-Answers should be brief but complete, using simple, modern language.

-Avoid repetition, filler, or long paragraphs.

-Group related flashcards by themes or sections if the text has multiple ideas.

-Keep the tone clear, modern, and study-friendly (no robotic phrasing).

-directly Give the response in the form of array of object


Format consistently like this:
Q: [Question here]  
A: [Answer here]  

Here’s the text to turn into flashcards:
${content}
  `;

  const geminiResponse = await generateGeminiResponse(customFlashcardPrompt);

  const aiResponse = geminiResponse?.text;

  console.log(aiResponse);

  res.status(200).json(aiResponse);
});

export { getCurrentUser, summarize, flashCard };
