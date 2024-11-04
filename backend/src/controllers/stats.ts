import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { nodeCache } from "../app.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { Order } from "../models/order.js";
import { calculatePercentage } from "../utils/features.js";

export const getDashboardStats = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let stats = {};

    if (nodeCache.has("admin-stats")) {
      stats = JSON.parse(nodeCache.get("admin-stats") as string);
    } else {
      const today = new Date();

      const thisMonth = {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: today,
      };

      const lastMonth = {
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0),
      };

      const thisMonthProductsPromise = Product.find({
        createdAt: {
          $gte: thisMonth.start,
          $lte: thisMonth.end,
        },
      });

      const lastMonthProductsPromise = Product.find({
        createdAt: {
          $gte: lastMonth.start,
          $lte: lastMonth.end,
        },
      });

      const thisMonthUsersPromise = User.find({
        createdAt: {
          $gte: thisMonth.start,
          $lte: thisMonth.end,
        },
      });

      const lastMonthUsersPromise = User.find({
        createdAt: {
          $gte: lastMonth.start,
          $lte: lastMonth.end,
        },
      });

      const thisMonthOrdersPromise = Order.find({
        createdAt: {
          $gte: thisMonth.start,
          $lte: thisMonth.end,
        },
      });

      const lastMonthOrdersPromise = Order.find({
        createdAt: {
          $gte: lastMonth.start,
          $lte: lastMonth.end,
        },
      });

      const [
        thisMonthProducts,
        thisMonthUsers,
        thisMonthOrders,
        lastMonthProducts,
        lastMonthUsers,
        lastMonthOrders,
      ] = await Promise.all([
        thisMonthProductsPromise,
        thisMonthUsersPromise,
        thisMonthOrdersPromise,
        lastMonthProductsPromise,
        lastMonthUsersPromise,
        lastMonthOrdersPromise,
      ]);


      const productPercentage = calculatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
      );

      const userPercentage = calculatePercentage(
        thisMonthUsers.length,
        lastMonthUsers.length
      );

      const orderPercentage = calculatePercentage(
        thisMonthOrders.length,
        lastMonthOrders.length
      );

      stats = {
        productPercentage,
        userPercentage,
        orderPercentage,
      };

      nodeCache.set("admin-stats",JSON.stringify(stats))
    }

    return res.status(200).json({
      success: true,
      stats,
    });
  }
);

export const getPieStats = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const getBarStats = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const getLineStats = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {}
);
