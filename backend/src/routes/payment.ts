import express from "express";
import {
  allCoupons,
  applyDiscount,
  deleteCoupon,
  newCoupon,
} from "../controllers/payment.js";
import { adminOnly } from "../middlewares/auth.js";

const router = express.Router();

// POST - /api/v1/payment/coupon/new
router.post("/coupon/new", adminOnly, newCoupon);

// GET - /api/v1/payment/discount
router.get("/discount", applyDiscount);

// GET - /api/v1/payment/coupons
router.get("/coupons", adminOnly, allCoupons);

// DELETE - /api/v1/payment/<id>
router.delete("/:id", adminOnly, deleteCoupon);

export default router;
