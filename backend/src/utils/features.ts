import mongoose from "mongoose";
import { InvalidateCacheType } from "../types/types.js";
import { nodeCache } from "../app.js";

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
  }
  if (admin) {
  }
};
