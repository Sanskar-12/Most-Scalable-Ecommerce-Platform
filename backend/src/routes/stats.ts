import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  getBarStats,
  getDashboardStats,
  getLineStats,
  getPieStats,
} from "../controllers/stats.js";

const router = express.Router();

// GET - /api/v1/dashboard/stats
router.get("/stats", adminOnly, getDashboardStats);

// GET - /api/v1/dashboard/pie
router.get("/pie", adminOnly, getPieStats);

// GET - /api/v1/dashboard/bar
router.get("/bar", adminOnly, getBarStats);

// GET - /api/v1/dashboard/line
router.get("/line", adminOnly, getLineStats);

export default router;
