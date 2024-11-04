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

      const sixMonthsAgo = new Date();

      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

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

      const sixMonthOrdersPromise = Order.find({
        createdAt: {
          $gte: sixMonthsAgo,
          $lte: today,
        },
      });

      const [
        thisMonthProducts,
        thisMonthUsers,
        thisMonthOrders,
        lastMonthProducts,
        lastMonthUsers,
        lastMonthOrders,
        productCount,
        userCount,
        allOrders,
        sixMonthOrders,
        categories,
        maleRatio,
        latestTransactions,
      ] = await Promise.all([
        thisMonthProductsPromise,
        thisMonthUsersPromise,
        thisMonthOrdersPromise,
        lastMonthProductsPromise,
        lastMonthUsersPromise,
        lastMonthOrdersPromise,
        Product.countDocuments(),
        User.countDocuments(),
        Order.find({}).select("total"),
        sixMonthOrdersPromise,
        Product.distinct("category"),
        User.countDocuments({ gender: "male" }),
        Order.find({})
          .select(["orderItems", "discount", "total", "status"])
          .limit(4),
      ]);

      let thisMonthRevenue = 0;
      let lastMonthRevenue = 0;

      thisMonthOrders.forEach(
        (order) => (thisMonthRevenue = thisMonthRevenue + order.total)
      );

      lastMonthOrders.forEach(
        (order) => (lastMonthRevenue = lastMonthRevenue + order.total)
      );

      const changePercent = {
        revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
        products: calculatePercentage(
          thisMonthProducts.length,
          lastMonthProducts.length
        ),
        users: calculatePercentage(
          thisMonthUsers.length,
          lastMonthUsers.length
        ),
        orders: calculatePercentage(
          thisMonthOrders.length,
          lastMonthOrders.length
        ),
      };

      let totalRevenue = 0;

      allOrders.forEach((order) => (totalRevenue = totalRevenue + order.total));

      const count = {
        totalRevenue: totalRevenue,
        product: productCount,
        user: userCount,
        order: allOrders.length,
      };

      const orderCountInaMonth = new Array(6).fill(0);
      const ordersRevenueCountInaMonth = new Array(6).fill(0);

      sixMonthOrders.forEach((order) => {
        const creationDate = order.createdAt;
        const monthDiff =
          (today.getMonth() - creationDate.getMonth() + 12) % 12;

        if (monthDiff < 6) {
          orderCountInaMonth[6 - monthDiff - 1] += 1;
          ordersRevenueCountInaMonth[6 - monthDiff - 1] += order.total;
        }
      });

      const chart = {
        orderCountInaMonth,
        ordersRevenueCountInaMonth,
      };

      const categoriesCountPromise = categories.map((category) =>
        Product.countDocuments({ category })
      );

      const categoriesCount = await Promise.all(categoriesCountPromise);

      const categoryCount: Record<string, number>[] = [];

      categories.forEach((category, i) =>
        categoryCount.push({
          [category]: Math.round((categoriesCount[i] / productCount) * 100),
        })
      );

      const userRatio = {
        male: maleRatio,
        female: userCount - maleRatio,
      };

      const modifiedLatestTransactions = latestTransactions.map((order) => ({
        _id: order._id,
        discount: order.discount,
        amount: order.total,
        quantity: order.orderItems.length,
        status: order.status,
      }));

      stats = {
        changePercent,
        count,
        chart,
        categoryCount,
        userRatio,
        modifiedLatestTransactions,
      };

      nodeCache.set("admin-stats", JSON.stringify(stats));
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
