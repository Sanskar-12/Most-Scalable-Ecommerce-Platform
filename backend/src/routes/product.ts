import express from "express";
import singleUpload from "../middlewares/multer.js";
import { newProduct } from "../controllers/product.js";
import { adminOnly } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new", adminOnly, singleUpload, newProduct);

export default router;
