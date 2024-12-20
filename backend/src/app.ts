import express from "express";
import { config } from "dotenv";
import { connectDB, connectRedis } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
// import NodeCache from "node-cache";
import morgan from "morgan";
import Stripe from "stripe";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

// importing routes
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/stats.js";

// env
config({
  path: "./.env",
});

const app = express();

// database and redis connection
connectDB();
export const redis = connectRedis(process.env.REDISURI as string);
export const TTL = process.env.TTL || 4 * 60 * 60; // 4 hours Time to live

// middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// Cloudinary Setup
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPIKEY,
  api_secret: process.env.CLOUDAPISECRET,
});

// Stripe setup
export const stripe = new Stripe(process.env.STRIPESECRETKEY as string);
// export const nodeCache = new NodeCache();

// routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);

// static folder for images
app.use("/uploads", express.static("uploads"));

// error middleware
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
