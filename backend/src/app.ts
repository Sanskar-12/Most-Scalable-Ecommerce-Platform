import express from "express";
import { config } from "dotenv";

// importing routes
import userRoute from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";

config({
  path: "./.env",
});

const app = express();

connectDB();

// middlewares
app.use(express.json());

// routes
app.use("/api/v1/user", userRoute);

// error middleware
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
