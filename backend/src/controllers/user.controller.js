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

  const [titlePart, contentPart] = geminiResponse.text.split("content:");

  const title = titlePart.replace("title:", "").trim(" ");
  const aiResponse = contentPart;

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

  const message = await UserChat.create({
    user: id,
    messages: [
      {
        userPromptType: option,
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

const quiz = asyncHandler(async (req, res) => {
  const { content, option, difficulty } = req.body;

  const { id } = req.user;

  const customQuizPrompt = `
I want you to act as an expert quiz creator.
Your mission is to generate high-quality, clear, and well-balanced quiz questions based on the content I'll provide.

🎯 Requirements:

- Use the difficulty level I provide (easy, medium, or hard) to shape the style, depth, and complexity of the questions.

- Each quiz item must include:
  • Q: (the question)
  • options: [array of 4 options]
  • answer: (the correct option)
  • explanation: (quick, simple reasoning)

- Questions should target understanding, not just memorization — focus on concepts, logic, application, and key details.

- Keep wording modern, clean, and student-friendly. No fluff. No walls of text.

- Make the options believable but not confusing or repetitive.

- If the content includes multiple themes, spread questions across them evenly.

- Return everything as an array of objects only.

Format example:
{
  Q: "What does X mean?",
  options: ["A", "B", "C", "D"],
  answer: "B",
  explanation: "Short explanation here."
}

Here’s the content and difficulty:
content: ${content}
difficulty: ${difficulty}
`;

  const geminiResponse = await generateGeminiResponse(customQuizPrompt);
  const aiResponse = geminiResponse?.text;

  const message = await UserChat.create({
    user: id,
    messages: [
      {
        userPromptType: option,
        quizDifficulty: difficulty,
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

const getCurrentQuizData = asyncHandler(async (req, res) => {
  const quizId = req.params.id;

  const quizData = await UserChat.findById(quizId);

  res.status(200).json(
    new ApiResponse(200, "success", {
      quizData: quizData?.messages?.[0]?.aiResponse,
    })
  );
});

const changeTheme = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);

  const theme = user?.isDarkTheme;

  const updatedTheme = await User.findByIdAndUpdate(
    id,
    {
      isDarkTheme: !theme,
    },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, "success", updatedTheme?.isDarkTheme));
});

const getPreviousSummary = asyncHandler(async (req, res) => {
  const [array] = req.body;

  let responseArray = [];

  for (let i = 0; i < array.length; i++) {
    const content = await UserChat.findById(array[i]);

    if (content?.messages[0]?.userPromptType === "summarize") {
      responseArray.push({
        title: content?.messages[0]?.userPromptTitle,
        aiResponse: content?.messages[0]?.aiResponse,
      });
    }
  }

  res.status(200).json(new ApiResponse(200, "success", responseArray));
});

const getPreviousFlashCard = asyncHandler(async (req, res) => {
  const [array] = req.body;

  let responseArray = [];

  for (let i = 0; i < array.length; i++) {
    const content = await UserChat.findById(array[i]);

    if (content?.messages[0]?.userPromptType === "flashcard") {
      responseArray.push({
        aiResponse: content?.messages[0]?.aiResponse,
      });
    }
  }

  console.log(responseArray);

  res.status(200).json(new ApiResponse(200, "success", responseArray));
});

const getPreviousQuiz = asyncHandler(async (req, res) => {
  const [array] = req.body;

  let responseArray = [];

  for (let i = 0; i < array.length; i++) {
    const content = await UserChat.findById(array[i]);

    if (content?.messages[0]?.userPromptType === "quiz") {
      responseArray.push({
        difficulty: content?.messages[0]?.quizDifficulty,
        aiResponse: content?.messages[0]?.aiResponse,
      });
    }
  }

  console.log(responseArray);

  res.status(200).json(new ApiResponse(200, "success", responseArray));
});

export {
  getCurrentUser,
  summarize,
  flashCard,
  quiz,
  getCurrentQuizData,
  changeTheme,
  getPreviousSummary,
  getPreviousFlashCard,
  getPreviousQuiz,
};
