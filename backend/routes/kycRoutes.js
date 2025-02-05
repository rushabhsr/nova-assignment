import express from "express";
import multer from "multer";
import { submitKYC, getAllKYC, updateKYCStatus } from "../controllers/kycController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// User submits KYC
router.post("/", protect, upload.single("idDocument"), submitKYC);

// Admin gets all KYC submissions
router.get("/", protect, isAdmin, getAllKYC);

// Admin updates KYC status
router.put("/:id", protect, isAdmin, updateKYCStatus);

export default router;
