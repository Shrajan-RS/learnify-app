import jwt from "jsonwebtoken";

const generateJWTToken = (user) => {
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRES || "7d",
  });

  return token;
};

export default generateJWTToken;
