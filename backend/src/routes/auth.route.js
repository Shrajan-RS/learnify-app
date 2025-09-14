import { Router } from "express";

import {
  signup,
  verification,
  login,
  logout,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/verify", verification);
router.post("/login", login);
router.post("/logout", logout);



export { router };
