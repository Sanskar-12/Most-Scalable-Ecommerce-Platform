import express from "express"
import { deleteUser, getAllUsers, getUserDetails, newUser } from "../controllers/user.js"

const router=express.Router()

// POST - /api/v1/user/new
router.post("/new",newUser)

// GET - /api/v1/user/all
router.get("/all",getAllUsers)

// GET - /api/v1/user/<id>
router.get("/:id",getUserDetails)

// DELETE - /api/v1/user/<id>
router.delete("/:id",deleteUser)

export default router