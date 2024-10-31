import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserDetails,
  newUser,
} from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();


// POST - /api/v1/user/new
router.post("/new", singleUpload, newUser);

// GET - /api/v1/user/all
router.get("/all", adminOnly, getAllUsers);

// GET - /api/v1/user/<id>
router.get("/:id", getUserDetails);

// DELETE - /api/v1/user/<id>
router.delete("/:id", adminOnly, deleteUser);

export default router;
