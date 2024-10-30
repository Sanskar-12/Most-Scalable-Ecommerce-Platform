import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewProductsRequestBody } from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";

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

    return res.status(200).json({
      success: true,
      message: "Product Created Successfully",
    });
  }
);
