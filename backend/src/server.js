import dotenv from "dotenv";
import connectDB from "./db/db.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Is Running on PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Failed To Run The Server", error);
  });
