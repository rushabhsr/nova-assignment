import express from "express";
import multer from "multer";
import { submitKYC, getKYC, getAllKYC, updateKYCStatus, getKPIs, resubmitKYC } from "../controllers/kycController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
const router = express.Router();

router.get("/stats", getKPIs);

router.post("/", protect, upload, submitKYC);

router.get("/", protect, getKYC);
router.get("/all", protect, isAdmin, getAllKYC);

router.put("/:id", protect, isAdmin, updateKYCStatus);

router.patch("/:id", protect,upload, resubmitKYC);

export default router;
