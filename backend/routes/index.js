import express from "express";
import authRoutes from "./authRoutes.js";

import kycRoutes from "./kycRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/kyc", kycRoutes);

export default router;
