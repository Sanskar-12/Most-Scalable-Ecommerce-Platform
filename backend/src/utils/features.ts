import mongoose, { Document } from "mongoose";
import { InvalidateCacheType, OrderItemType } from "../types/types.js";
import { nodeCache } from "../app.js";
import { Product } from "../models/product.js";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(
      process.env.MONGOURI as string,
      {
        dbName: "ecommerce",
      }
    );

    console.log(`Database connected as ${connection.host}`);
  } catch (error) {
    console.log(`${error}`);
  }
};

export const invalidateCache = ({
  product,
  productId,
  order,
  orderId,
  admin,
  userId,
  coupon,
  couponId,
}: InvalidateCacheType) => {
  if (product) {
    const productKeys: string[] = [
      "latest-products",
      "categories",
      "admin-products",
    ];

    if (typeof productId === "string") productKeys.push(`product-${productId}`);

    if (typeof productId === "object") {
      productId.forEach((id) => productKeys.push(`product-${id}`));
    }

    nodeCache.del(productKeys);
  }
  if (order) {
    const orderKeys: string[] = [
      `my-orders-${userId}`,
      "all-orders",
      `order-${orderId}`,
    ];

    nodeCache.del(orderKeys);
  }
  if (admin) {
    let adminKeys: string[] = [
      "admin-stats",
      "admin-pie-charts",
      "admin-bar-charts",
      "admin-line-charts",
    ];

    nodeCache.del(adminKeys);
  }
  if (coupon) {
    let couponKeys: string[] = ["all-coupons"];

    nodeCache.del(couponKeys);
  }
};

export const reduceStock = async (orderItems: OrderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);

    if (!product) throw new Error("Product Not Found");

    product.stock = product.stock - order.quantity;
    await product.save();
  }
};

export const calculatePercentage = (
  thisMonthData: number,
  lastMonthData: number
) => {
  if (lastMonthData === 0) {
    return thisMonthData * 100;
  }

  const percent = ((thisMonthData - lastMonthData) / lastMonthData) * 100;

  return Number(percent.toFixed(0));
};

interface myOrder extends Document {
  createdAt: Date;
  total: number;
}

type getOrderDataOfChartType = {
  sixMonthOrders: myOrder[];
  today: Date;
};

export const getOrderDataOfChart = ({
  sixMonthOrders,
  today,
}: getOrderDataOfChartType) => {
  const orderCountInaMonth = new Array(6).fill(0);
  const ordersRevenueCountInaMonth = new Array(6).fill(0);

  sixMonthOrders.forEach((order) => {
    const creationDate = order.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

    if (monthDiff < 6) {
      orderCountInaMonth[6 - monthDiff - 1] += 1;
      ordersRevenueCountInaMonth[6 - monthDiff - 1] += order.total;
    }
  });

  return {
    orderCountInaMonth,
    ordersRevenueCountInaMonth,
  };
};

interface myDoc extends Document {
  createdAt: Date;
  total?: number;
  discount?: number;
}

type getBarChartDataType = {
  length: number;
  docArr: myDoc[];
  today: Date;
  property?: string;
};

export const getBarChartData = ({
  length,
  docArr,
  today,
  property,
}: getBarChartDataType) => {
  const data = new Array(length).fill(0);

  docArr.forEach((order) => {
    const creationDate = order.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

    if (monthDiff < length) {
      if (property === "total") {
        data[length - monthDiff - 1] += order.total;
      } else if (property === "discount") {
        data[length - monthDiff - 1] += order.discount;
      } else {
        data[length - monthDiff - 1] += 1;
      }
    }
  });

  return data;
};

const getBase64 = (file: Express.Multer.File) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

export const uploadToCloudinary = async (files: Express.Multer.File[]) => {
  const promises = files.map((file) => {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload(getBase64(file), (error, result) => {
        if (error) return reject(error);
        resolve(result!);
      });
    });
  });

  const result = await Promise.all(promises);

  return result.map((i) => ({
    public_id: i.public_id,
    url: i.secure_url,
  }));
};

export const deleteFromCloudinary = async (publicIds: string[]) => {
  const promises = publicIds.map((id) => {
    return new Promise<void>((resolve, reject) => {
      cloudinary.uploader.destroy(id, (error, result) => {
        if (error) return reject(error);
        resolve();
      });
    });
  });

  await Promise.all(promises);
};
