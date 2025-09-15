import { Router } from "express";

import {
  signup,
  verification,
  login,
  logout,
} from "../controllers/auth.controller.js";
import ratelimiter from "../middlewares/rateLimiter.js";

const router = Router();

router.post("/signup", signup);
router.post("/verify", verification);
router.post("/login", ratelimiter, login);
router.post("/logout", logout);

export { router };
