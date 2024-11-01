import express from "express";
import { newOrder } from "../controllers/order.js";

const router = express.Router();

// POST - /api/v1/order/new
router.post("/new", newOrder);

export default router;
