import express from "express";
import {
  allCoupons,
  applyDiscount,
  createPaymentIntent,
  deleteCoupon,
  newCoupon,
  updateCoupon,
  viewCoupon,
} from "../controllers/payment.js";
import { adminOnly } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// POST - /api/v1/payment/create
router.post("/create", createPaymentIntent);

// POST - /api/v1/payment/coupon/new
router.post("/coupon/new", adminOnly, newCoupon);

// GET - /api/v1/payment/discount
router.get("/discount", applyDiscount);

// GET - /api/v1/payment/coupons
router.get("/coupons", adminOnly, allCoupons);

// GET - /api/v1/payment/view/coupon
router.get("/view/coupon/:id", adminOnly, viewCoupon);

// PUT - /api/v1/payment/<id>
router.put("/:id", adminOnly, singleUpload, updateCoupon);

// DELETE - /api/v1/payment/<id>
router.delete("/:id", adminOnly, deleteCoupon);

export default router;
