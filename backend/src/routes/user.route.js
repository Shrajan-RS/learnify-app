import { Router } from "express";
import { getCurrentUser } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/get-current-user", authMiddleware, getCurrentUser);

export { router };
