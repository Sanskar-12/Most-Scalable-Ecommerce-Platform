import express from "express";
import { multiUpload, singleUpload } from "../middlewares/multer.js";
import {
  allCategories,
  deleteProduct,
  getAdminProducts,
  getAllProductsWithFilters,
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
router.put("/:id", adminOnly, singleUpload, updateProductDetails);

// DELETE - /api/v1/product/<id>
router.delete("/:id", adminOnly, deleteProduct);

export default router;
