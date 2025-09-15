import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { router as userAuth } from "./routes/auth.route.js";
import errorHandler from "./middlewares/error.handler.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use("/api/v1/auth/user", userAuth);

app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Route ${req.originalUrl} not found`));
});

app.use(errorHandler);
export { app };
