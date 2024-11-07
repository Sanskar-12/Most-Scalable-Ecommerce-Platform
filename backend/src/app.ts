import express from "express";
import { config } from "dotenv";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import morgan from "morgan";
import Stripe from "stripe";

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

// database connection
connectDB();

// middlewares
app.use(express.json());
app.use(morgan("dev"));

export const stripe = new Stripe(process.env.STRIPESECRETKEY as string);
export const nodeCache = new NodeCache();

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
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
