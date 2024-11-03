import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewCouponRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { Coupon } from "../models/coupon.js";
import { nodeCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

export const newCoupon = TryCatch(
  async (
    req: Request<{}, {}, NewCouponRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { coupon, amount } = req.body;

    if (!coupon || !amount)
      return next(new ErrorHandler("Please fill all fields", 400));

    await Coupon.create({
      coupon,
      amount,
    });

    await invalidateCache({
      product: false,
      order: false,
      coupon: true,
      admin: true,
    });

    return res.status(200).json({
      success: true,
      message: `Coupon ${coupon} created Successfully`,
    });
  }
);

export const applyDiscount = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { coupon } = req.query;

    const discount = await Coupon.findOne({ coupon });

    if (!discount) return next(new ErrorHandler("Invalid Coupon Code", 400));

    return res.status(200).json({
      success: true,
      discount: discount.amount,
    });
  }
);

export const allCoupons = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let coupons = [];

    if (nodeCache.has("all-coupons")) {
      coupons = JSON.parse(nodeCache.get("all-coupons") as string);
    } else {
      coupons = await Coupon.find({});
      nodeCache.set("all-coupons", JSON.stringify(coupons));
    }

    return res.status(200).json({
      success: true,
      coupons: coupons,
    });
  }
);

export const deleteCoupon = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);

    if (!coupon) return next(new ErrorHandler("Coupon not found", 400));

    await coupon.deleteOne();

    await invalidateCache({
      product: false,
      order: false,
      coupon: true,
      admin: true,
    });

    return res.status(200).json({
      success: true,
      message: `Coupon ${coupon.coupon} deleted Successfully`,
    });
  }
);
