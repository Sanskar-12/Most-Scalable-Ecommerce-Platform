import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewCouponRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { Coupon } from "../models/coupon.js";
import { redis, stripe, TTL } from "../app.js";
import { invalidateCache } from "../utils/features.js";

export const createPaymentIntent = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.body;

    if (!amount) return next(new ErrorHandler("Please enter amount", 400));

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: "inr",
    });

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  }
);

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
    let coupons;

    const key = `all-coupons`;

    coupons = await redis.get(key);

    if (coupons) {
      coupons = JSON.parse(coupons);
    } else {
      coupons = await Coupon.find({});
      await redis.setex(key, TTL, JSON.stringify(coupons));
    }

    return res.status(200).json({
      success: true,
      coupons: coupons,
    });
  }
);

export const viewCoupon = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const existingCoupon = await Coupon.findById(id);

    if (!existingCoupon) return next(new ErrorHandler("Coupon not found", 400));

    await invalidateCache({
      product: false,
      order: false,
      coupon: true,
      admin: true,
    });

    return res.status(200).json({
      success: true,
      coupon: existingCoupon,
    });
  }
);

export const updateCoupon = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const { coupon, amount } = req.body;

    const existingCoupon = await Coupon.findById(id);

    if (!existingCoupon) return next(new ErrorHandler("Coupon not found", 400));

    if (coupon) existingCoupon.coupon = coupon;
    if (amount) existingCoupon.amount = amount;

    await existingCoupon.save();

    await invalidateCache({
      product: false,
      order: false,
      coupon: true,
      admin: true,
    });

    return res.status(200).json({
      success: true,
      message: `Coupon ${existingCoupon.coupon} updated Successfully`,
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
