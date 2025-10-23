import rateLimit from "express-rate-limit";

const ratelimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 15,
  message: "Too Many Requests, Please Wait For A While!",
  standardHeaders: true,
  legacyHeaders: false,
});

export default ratelimiter;
