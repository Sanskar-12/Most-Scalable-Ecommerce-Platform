import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { nodeCache } from "../app.js";

export const newOrder = TryCatch(
  async (
    req: Request<{}, {}, NewOrderRequestBody>,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const {
      shippingInfo,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
      orderItems,
    } = req.body;

    if (!shippingInfo || !user || !subtotal || !tax || !total || !orderItems) {
      return next(new ErrorHandler("Please fill all fields", 400));
    }

    await Order.create({
      shippingInfo,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
      orderItems,
    });

    await reduceStock(orderItems);

    await invalidateCache({ product: true, order: true, admin: true });

    return res.status(200).json({
      success: true,
      message: "Order Created Successfully",
    });
  }
);

export const myOrders = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: user } = req.query;

    const key = `my-orders-${user}`;

    let orders = [];

    if (nodeCache.has(key)) {
      orders = JSON.parse(nodeCache.get(key) as string);
    } else {
      orders = await Order.find({ user });
      nodeCache.set(key, JSON.stringify(orders));
    }

    return res.status(200).json({
      success: true,
      orders,
    });
  }
);

export const allOrders = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const key = `all-orders`;

    let orders = [];

    if (nodeCache.has(key)) {
      orders = JSON.parse(nodeCache.get(key) as string);
    } else {
      orders = await Order.find({});
      nodeCache.set(key, JSON.stringify(orders));
    }

    return res.status(200).json({
      success: true,
      orders,
    });
  }
);
