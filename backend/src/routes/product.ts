import express from "express";
import { multiUpload, singleUpload } from "../middlewares/multer.js";
import {
  addOrUpdateReview,
  allCategories,
  deleteProduct,
  deleteReview,
  getAdminProducts,
  getAllProductsWithFilters,
  getAllReviewsOfProduct,
  getProductDetails,
  latestProduct,
  newProduct,
  updateProductDetails,
} from "../controllers/product.js";
import { adminOnly } from "../middlewares/auth.js";

const router = express.Router();

// GET - /api/v1/product/latest
router.get("/latest", latestProduct);

// GET - /api/v1/product/categories
router.get("/categories", allCategories);

// POST - /api/v1/product/new
router.post("/new", adminOnly, multiUpload, newProduct);

// GET - /api/v1/product/get/products
router.get("/get/products", adminOnly, getAdminProducts);

// GET - /api/v1/product/search?search=""&price=""&category=""&sort=""
router.get("/search", getAllProductsWithFilters);

// GET - /api/v1/product/<id>
router.get("/:id", getProductDetails);

// PUT - /api/v1/product/<id>
router.put("/:id", adminOnly, multiUpload, updateProductDetails);

// DELETE - /api/v1/product/<id>
router.delete("/:id", adminOnly, deleteProduct);

// GET - /api/v1/get/all/reviews/<id>
router.get("/get/all/review/:id", getAllReviewsOfProduct);

// POST - /api/v1/add/update/review/<id>
router.post("/add/update/review/:id", multiUpload, addOrUpdateReview);

// DELETE - /api/v1/delete/review/<id>
router.delete("/delete/review/:id", deleteReview);

export default router;
