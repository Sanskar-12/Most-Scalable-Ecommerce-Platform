import express from "express";
import {
  allOrders,
  deleteOrder,
  getOrderDetail,
  myOrders,
  newOrder,
  processOrder,
} from "../controllers/order.js";
import { adminOnly } from "../middlewares/auth.js";

const router = express.Router();

// POST - /api/v1/order/new
router.post("/new", newOrder);

// GET - /api/v1/order/my/orders?id=""
router.get("/my/orders", myOrders);

// GET - /api/v1/order/all
router.get("/all", adminOnly, allOrders);

// GET - /api/v1/order/<id>
router.get("/:id", getOrderDetail);

// PUT - /api/v1/order/<id>
router.put("/:id", adminOnly, processOrder);

// DELETE - /api/v1/order/<id>
router.delete("/:id", adminOnly, deleteOrder);

export default router;
