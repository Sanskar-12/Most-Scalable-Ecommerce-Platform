import mongoose from "mongoose";
import { InvalidateCacheType, OrderItemType } from "../types/types.js";
import { nodeCache } from "../app.js";
import { Product } from "../models/product.js";

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(
      process.env.MONGOURI as string
    );

    console.log(`Database connected as ${connection.host}`);
  } catch (error) {
    console.log(`${error}`);
  }
};

export const invalidateCache = async ({
  product,
  productId,
  order,
  orderId,
  admin,
  userId,
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
