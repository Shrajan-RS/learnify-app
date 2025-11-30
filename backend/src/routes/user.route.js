import { Router } from "express";
import {
  changeTheme,
  flashCard,
  getCurrentQuizData,
  getCurrentUser,
  getPreviousFlashCard,
  getPreviousQuiz,
  getPreviousSummary,
  quiz,
  summarize,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/get-current-user", authMiddleware, getCurrentUser);
router.post("/summary", authMiddleware, summarize);
router.post("/flashcard", authMiddleware, flashCard);
router.post("/quiz", authMiddleware, quiz);

router.get("/quiz/:id", authMiddleware, getCurrentQuizData);
router.post("/themeChange", authMiddleware, changeTheme);
router.post("/get-previous-summary", authMiddleware, getPreviousSummary);
router.post("/get-previous-flashcard", authMiddleware, getPreviousFlashCard);
router.post("/get-previous-quiz", authMiddleware, getPreviousQuiz);

export { router };
