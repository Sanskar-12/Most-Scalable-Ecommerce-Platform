import express from "express";
import { allOrders, myOrders, newOrder } from "../controllers/order.js";
import { adminOnly } from "../middlewares/auth.js";

const router = express.Router();

// POST - /api/v1/order/new
router.post("/new", newOrder);

// GET - /api/v1/order/my/orders?id=""
router.get("/my/orders", myOrders);
 
// GET - /api/v1/order/all
router.get("/all", adminOnly, allOrders);

export default router;
