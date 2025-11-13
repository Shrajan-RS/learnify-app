import { Router } from "express";
import {
  flashCard,
  getCurrentUser,
  summarize,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/get-current-user", authMiddleware, getCurrentUser);
router.post("/summary", authMiddleware, summarize);
router.post("/flashcard", authMiddleware, flashCard);

export { router };
