import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import {
  BaseQueryType,
  NewProductsRequestBody,
  SearchRequestQuery,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { redis, TTL } from "../app.js";
import {
  deleteFromCloudinary,
  findAverageRating,
  invalidateCache,
  uploadToCloudinary,
} from "../utils/features.js";
import { User } from "../models/user.js";
import { Review } from "../models/review.js";

export const newProduct = TryCatch(
  async (
    req: Request<{}, {}, NewProductsRequestBody>,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { name, price, stock, category, description } = req.body;
    const photos = req.files as Express.Multer.File[] | undefined;

    if (!photos) return next(new ErrorHandler("Please upload photo", 400));

    if (photos.length < 1)
      return next(new ErrorHandler("Please add atleast one Photo", 400));

    if (photos.length > 5)
      return next(new ErrorHandler("You can only upload 5 Photos", 400));

    if (!name || !price || !stock || !category || !description) {
      return next(new ErrorHandler("Please fill all fields", 400));
    }

    // Upload to Cloudinary
    const photosUrl = await uploadToCloudinary(photos);

    await Product.create({
      name,
      description,
      price,
      stock,
      category: category.toLowerCase(),
      photos: photosUrl,
    });

    await invalidateCache({ product: true, admin: true });

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

    products = await redis.get(key);

    if (products) {
      products = JSON.parse(products);
    } else {
      products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
      await redis.setex(key, TTL, JSON.stringify(products));
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

    categories = await redis.get(key);

    if (categories) {
      categories = JSON.parse(categories);
    } else {
      categories = await Product.distinct("category");
      await redis.setex(key, TTL, JSON.stringify(categories));
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

    products = await redis.get(key);

    if (products) {
      products = JSON.parse(products);
    } else {
      products = await Product.find({});
      await redis.setex(key, TTL, JSON.stringify(products));
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

    product = await redis.get(key);

    if (product) {
      product = JSON.parse(product);
    } else {
      product = await Product.findById(id);

      if (!product) return next(new ErrorHandler("Product Not Found", 400));

      await redis.setex(key, TTL, JSON.stringify(product));
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

    const { name, price, stock, category, description } = req.body;
    const photos = req.files as Express.Multer.File[] | undefined;

    const product = await Product.findById(id);

    if (!product) return next(new ErrorHandler("Product Not Found", 400));

    if (photos && photos?.length > 0) {
      const photoUrls = await uploadToCloudinary(photos);

      const publicIds = product.photos.map((photo) => photo.public_id);

      await deleteFromCloudinary(publicIds);

      product.photos = photoUrls as unknown as typeof product.photos;
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;
    if (description) product.description = description;

    await product.save();

    await invalidateCache({
      product: true,
      productId: String(product._id),
      admin: true,
    });

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

    const publicIds = product.photos.map((photo) => photo.public_id);

    await deleteFromCloudinary(publicIds);

    await product.deleteOne();

    await invalidateCache({
      product: true,
      productId: String(product._id),
      admin: true,
    });

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

export const getAllReviewsOfProduct = TryCatch(async (req, res, next) => {
  const reviews = await Review.find({
    product: req.params.id,
  })
    .populate("user", "name photo")
    .sort({ updatedAt: -1 });

  return res.status(200).json({
    success: true,
    reviews,
  });
});

export const addOrUpdateReview = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.query.id);

  if (!user) return next(new ErrorHandler("Not logged in", 400));

  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not found", 400));

  const { comment, rating } = req.body;

  const alreadyReviewed = await Review.findOne({
    user: user._id,
    product: product._id,
  });

  if (alreadyReviewed) {
    if (comment) alreadyReviewed.comment = comment;
    alreadyReviewed.rating = rating;

    await alreadyReviewed.save();
  } else {
    await Review.create({
      comment,
      rating,
      user: user._id,
      product: product._id,
    });
  }

  const { avgRatings, totalNoOfReviews } = await findAverageRating(product._id);

  product.ratings = avgRatings;
  product.noOfReviews = totalNoOfReviews;

  await product.save();

  await invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  return res.status(200).json({
    success: true,
    message: alreadyReviewed
      ? "Review Updated Successfully"
      : "Review Added Successfully",
  });
});

export const deleteReview = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.query.id);

  if (!user) return next(new ErrorHandler("Not logged in", 400));

  const review = await Review.findById(req.params.id);

  if (!review) return next(new ErrorHandler("Review not found", 400));

  const isAuthentic = review.user.toString() === user._id.toString();

  if (!isAuthentic) return next(new ErrorHandler("Not Authorised", 400));

  await review.deleteOne();

  const product = await Product.findById(review.product);

  if (!product) return next(new ErrorHandler("Product not found", 400));

  const { avgRatings, totalNoOfReviews } = await findAverageRating(product._id);

  product.ratings = avgRatings;
  product.noOfReviews = totalNoOfReviews;

  await product.save();

  await invalidateCache({
    product: true,
    productId: String(review.product),
    admin: true,
  });

  return res.status(200).json({
    success: true,
    message: "Review Deleted Successfully",
  });
});
