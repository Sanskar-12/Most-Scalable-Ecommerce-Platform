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

    let order = await Order.create({
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

    await invalidateCache({
      product: true,
      order: true,
      admin: true,
      productId: order.orderItems.map((product) => String(product.productId)),
    });

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
      orders = await Order.find({}).populate("user", "name");
      nodeCache.set(key, JSON.stringify(orders));
    }

    return res.status(200).json({
      success: true,
      orders,
    });
  }
);

export const getOrderDetail = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const key = `order-${id}`;

    let order;

    if (nodeCache.has(key)) {
      order = JSON.parse(nodeCache.get(key) as string);
    } else {
      order = await Order.findById(id).populate("user", "name");

      if (!order) {
        return next(new ErrorHandler("Order not found", 400));
      }

      nodeCache.set(key, JSON.stringify(order));
    }

    return res.status(200).json({
      success: true,
      order,
    });
  }
);

export const processOrder = TryCatch(async (req, res, next): Promise<any> => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 400));
  }

  switch (order.status) {
    case "Processing":
      order.status = "Shipped";
      break;
    case "Shipped":
      order.status = "Delivered";
      break;

    default:
      order.status = "Delivered";
      break;
  }

  await order.save();

  await invalidateCache({
    product: false,
    order: true,
    orderId: String(order._id),
    admin: true,
    userId: order.user,
  });

  return res.status(200).json({
    success: true,
    message: "Order Processed Successfully",
  });
});

export const deleteOrder = TryCatch(async (req, res, next): Promise<any> => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 400));
  }

  await order.deleteOne();

  await invalidateCache({
    product: false,
    order: true,
    orderId: String(order._id),
    admin: true,
    userId: order.user,
  });

  return res.status(200).json({
    success: true,
    message: "Order Deleted Successfully",
  });
});
