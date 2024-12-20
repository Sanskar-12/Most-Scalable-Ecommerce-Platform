import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { redis, TTL } from "../app.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { Order } from "../models/order.js";
import {
  calculatePercentage,
  getBarChartData,
  getOrderDataOfChart,
} from "../utils/features.js";

export const getDashboardStats = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let stats;

    const key = `admin-stats`;

    stats = await redis.get(key);

    if (stats) {
      stats = JSON.parse(stats);
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
      }).select(["createdAt", "total"]);

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

      const { orderCountInaMonth, ordersRevenueCountInaMonth } =
        getOrderDataOfChart({
          sixMonthOrders,
          today,
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

      await redis.setex(key, TTL, JSON.stringify(stats));
    }

    return res.status(200).json({
      success: true,
      stats,
    });
  }
);

export const getPieStats = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let charts;

    const key = `admin-pie-charts`;

    charts = await redis.get(key);

    if (charts) {
      charts = JSON.parse(charts);
    } else {
      const allOrderPromise = Order.find({}).select([
        "total",
        "discount",
        "subtotal",
        "tax",
        "shippingCharges",
      ]);

      const [
        processingOrder,
        shippedOrder,
        deliveredOrder,
        categories,
        productCount,
        productOutOfStock,
        allOrders,
        allUsers,
        adminUsersCount,
        customerUsersCount,
      ] = await Promise.all([
        Order.countDocuments({ status: "Processing" }),
        Order.countDocuments({ status: "Shipped" }),
        Order.countDocuments({ status: "Delivered" }),
        Product.distinct("category"),
        Product.countDocuments({}),
        Product.countDocuments({ stock: 0 }),
        allOrderPromise,
        User.find({}).select("dob"),
        User.countDocuments({ role: "admin" }),
        User.countDocuments({ role: "user" }),
      ]);

      const orderFullfillment = {
        processing: processingOrder,
        shipped: shippedOrder,
        delivered: deliveredOrder,
      };

      const categoriesCountPromise = categories.map((category) =>
        Product.countDocuments({ category })
      );

      const categoriesCount = await Promise.all(categoriesCountPromise);

      const categoryCount: Record<string, number>[] = [];

      categories.map((category, index) =>
        categoryCount.push({
          [category]: Math.round((categoriesCount[index] / productCount) * 100),
        })
      );

      const stockAvailability = {
        inStock: productCount - productOutOfStock,
        outOfStock: productOutOfStock,
      };

      const grossIncome = allOrders.reduce(
        (prev, order) => prev + (order.total || 0),
        0
      );

      const discount = allOrders.reduce(
        (prev, order) => prev + (order.discount || 0),
        0
      );

      const productionCost = allOrders.reduce(
        (prev, order) => prev + (order.shippingCharges || 0),
        0
      );

      const burnt = allOrders.reduce(
        (prev, order) => prev + (order.tax || 0),
        0
      );

      const marketingCost = Math.round(grossIncome * (30 / 100));

      const netMargin =
        grossIncome - discount - productionCost - burnt - marketingCost;

      const revenueDistribution = {
        netMargin,
        discount,
        productionCost,
        burnt,
        marketingCost,
      };

      const adminCustomers = {
        adminUsersCount,
        customerUsersCount,
      };

      const usersAgeGroup = {
        teen: allUsers.filter((i) => i.age < 20).length,
        adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
        old: allUsers.filter((i) => i.age >= 40).length,
      };

      charts = {
        orderFullfillment,
        productCategories: categoryCount,
        stockAvailability,
        revenueDistribution,
        adminCustomers,
        usersAgeGroup,
      };

      await redis.setex(key, TTL, JSON.stringify(charts));
    }

    return res.status(200).json({
      success: true,
      charts,
    });
  }
);

export const getBarStats = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let charts;

    const key = `admin-bar-charts`;

    charts = await redis.get(key);

    if (charts) {
      charts = JSON.parse(charts);
    } else {
      const today = new Date();

      const sixMonthsAgo = new Date();
      const twelveMonthsAgo = new Date();

      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const sixMonthAgoProductsPromise = Product.find({
        createdAt: {
          $gte: sixMonthsAgo,
          $lte: today,
        },
      }).select("createdAt");

      const sixMonthAgoUsersPromise = User.find({
        createdAt: {
          $gte: sixMonthsAgo,
          $lte: today,
        },
      }).select("createdAt");

      const twelveMonthAgoOrdersPromise = Order.find({
        createdAt: {
          $gte: twelveMonthsAgo,
          $lte: today,
        },
      }).select("createdAt");

      const [sixMonthAgoProducts, sixMonthAgoUsers, twelveMonthAgoOrders] =
        await Promise.all([
          sixMonthAgoProductsPromise,
          sixMonthAgoUsersPromise,
          twelveMonthAgoOrdersPromise,
        ]);

      const productsCount = getBarChartData({
        length: 6,
        docArr: sixMonthAgoProducts,
        today,
      });

      const usersCount = getBarChartData({
        length: 6,
        docArr: sixMonthAgoUsers,
        today,
      });

      const ordersCount = getBarChartData({
        length: 12,
        docArr: twelveMonthAgoOrders,
        today,
      });

      charts = {
        products: productsCount,
        users: usersCount,
        orders: ordersCount,
      };

      await redis.setex(key, TTL, JSON.stringify(charts));
    }

    return res.status(200).json({
      success: true,
      charts,
    });
  }
);

export const getLineStats = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let charts;

    const key = `admin-line-charts`;

    charts = await redis.get(key);

    if (charts) {
      charts = JSON.parse(charts);
    } else {
      const today = new Date();

      const twelveMonthsAgo = new Date();

      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      let baseQuery = {
        createdAt: {
          $gte: twelveMonthsAgo,
          $lte: today,
        },
      };

      const [
        twelveMonthAgoUsers,
        twelveMonthAgoProducts,
        twelveMonthAgoOrders,
      ] = await Promise.all([
        User.find(baseQuery).select("createdAt"),
        Product.find(baseQuery).select("createdAt"),
        Order.find(baseQuery).select(["createdAt", "total", "discount"]),
      ]);

      const usersCount = getBarChartData({
        length: 12,
        docArr: twelveMonthAgoUsers,
        today,
      });

      const productsCount = getBarChartData({
        length: 12,
        docArr: twelveMonthAgoProducts,
        today,
      });

      const revenueCount = getBarChartData({
        length: 12,
        docArr: twelveMonthAgoOrders,
        today,
        property: "total",
      });

      const discountAllotedCount = getBarChartData({
        length: 12,
        docArr: twelveMonthAgoOrders,
        today,
        property: "discount",
      });

      charts = {
        users: usersCount,
        products: productsCount,
        revenue: revenueCount,
        discountAlloted: discountAllotedCount,
      };

      await redis.setex(key, TTL, JSON.stringify(charts));
    }

    return res.status(200).json({
      success: true,
      charts,
    });
  }
);
