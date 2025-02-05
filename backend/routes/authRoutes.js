import express from "express";
import { registerUser, loginUser, validateToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/session", validateToken);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
