import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import {
  BaseQueryType,
  NewProductsRequestBody,
  SearchRequestQuery,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { nodeCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

export const newProduct = TryCatch(
  async (
    req: Request<{}, {}, NewProductsRequestBody>,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;

    if (!photo) return next(new ErrorHandler("Please upload photo", 400));

    if (!name || !price || !stock || !category) {
      // photo should be deleted if error comes after uploading the photo
      rm(photo.path, () => {
        console.log("Photo Deleted");
      });

      return next(new ErrorHandler("Please fill all fields", 400));
    }

    await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo?.path,
    });

    await invalidateCache({ product: true });

    return res.status(200).json({
      success: true,
      message: "Product Created Successfully",
    });
  }
);

export const latestProduct = TryCatch(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    let products;

    const key = "latest-products";

    if (nodeCache.has(key)) {
      products = JSON.parse(nodeCache.get(key) as string);
    } else {
      products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
      nodeCache.set(key, JSON.stringify(products));
    }

    return res.status(200).json({
      success: true,
      products,
    });
  }
);

export const allCategories = TryCatch(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    let categories;

    const key = "categories";

    if (nodeCache.has(key)) {
      categories = JSON.parse(nodeCache.get(key) as string);
    } else {
      categories = await Product.distinct("category");
      nodeCache.set(key, JSON.stringify(categories));
    }

    return res.status(200).json({
      success: true,
      categories,
    });
  }
);

export const getAdminProducts = TryCatch(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    let products;

    let key = "admin-products";

    if (nodeCache.has(key)) {
      products = JSON.parse(nodeCache.get(key) as string);
    } else {
      products = await Product.find({});
      nodeCache.set(key, JSON.stringify(products));
    }

    return res.status(200).json({
      success: true,
      products,
    });
  }
);

export const getProductDetails = TryCatch(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params;

    let key = `product-${id}`;

    let product;

    if (nodeCache.has(key)) {
      product = JSON.parse(nodeCache.get(key) as string);
    } else {
      product = await Product.findById(id);

      if (!product) return next(new ErrorHandler("Product Not Found", 400));

      nodeCache.set(key, JSON.stringify(product));
    }

    return res.status(200).json({
      success: true,
      product,
    });
  }
);

export const updateProductDetails = TryCatch(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params;

    const { name, price, stock, category } = req.body;
    const photo = req.file;

    const product = await Product.findById(id);

    if (!product) return next(new ErrorHandler("Product Not Found", 400));

    if (photo) {
      // old photo should be deleted
      rm(product.photo!, () => {
        console.log("Old Photo Deleted");
      });

      product.photo = photo.path;
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();

    await invalidateCache({ product: true, productId: String(product._id) });

    return res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
    });
  }
);

export const deleteProduct = TryCatch(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) return next(new ErrorHandler("Product Not Found", 400));

    rm(product.photo!, () => {
      console.log("Photo Deleted");
    });

    await product.deleteOne();

    await invalidateCache({ product: true, productId: String(product._id) });

    return res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  }
);

export const getAllProductsWithFilters = TryCatch(
  async (
    req: Request<{}, {}, {}, SearchRequestQuery>,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { search, price, category, sort } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.LIMITPERPAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQueryType = {};

    if (search) {
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (price) {
      4;
      baseQuery.price = {
        $lte: Number(price),
      };
    }

    if (category) {
      baseQuery.category = category;
    }

    const productPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const filteredProductPromise = Product.find(baseQuery);

    const [products, filteredProducts] = await Promise.all([
      productPromise,
      filteredProductPromise,
    ]);

    const totalPages = Math.ceil(filteredProducts.length / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPages,
    });
  }
);
