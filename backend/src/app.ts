import express from "express";
import {config} from "dotenv"

// importing routes
import userRoute from "./routes/user.js"
import { connectDB } from "./utils/features.js";

config({
  path:"./.env"
})
console.log(process.env.PORT)
const app = express();

connectDB()

// middlewares
app.use(express.json())

// routes
app.use("/api/v1/user",userRoute)

app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
