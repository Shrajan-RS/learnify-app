import { Router } from "express";

import {
  signup,
  verification,
  login,
  logout,
} from "../controllers/auth.controller.js";

import ratelimiter from "../middlewares/rate.limiter.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/verify", verification);
router.post("/login", ratelimiter, login);
// router.get("/home", authMiddleware, (res, req) => {});
router.post("/logout", logout);

export { router };
