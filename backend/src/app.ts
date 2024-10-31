import express from "express";
import { config } from "dotenv";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";

// importing routes
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";

config({
  path: "./.env",
});

const app = express();

connectDB();

// middlewares
app.use(express.json());

export const nodeCache = new NodeCache();

// routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);

// static folder for images
app.use("/uploads", express.static("uploads"));

// error middleware
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
