import { Router } from "express";

import {
  signup,
  googleSignUp,
  verification,
  login,
  googleLogin,
  logout,
} from "../controllers/auth.controller.js";

import ratelimiter from "../middlewares/rate.limiter.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", ratelimiter, signup);

router.post("/google-signup", ratelimiter, googleSignUp);

router.post("/verify", verification);
router.post("/login", ratelimiter, login);
router.post("/google-login", ratelimiter, googleLogin);
// router.get("/home", authMiddleware, (res, req) => {});
router.post("/logout", authMiddleware, logout);

export { router };
