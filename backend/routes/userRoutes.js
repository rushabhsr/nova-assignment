import express from "express";
import { getAllUsers, getUserById } from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, isAdmin, getAllUsers); // Admin: Get all users
router.get("/:id", protect, getUserById); // Authenticated user: Get single user details

export default router;
