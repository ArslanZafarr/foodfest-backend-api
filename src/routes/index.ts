import { Router } from "express";
import authRoutes from "./auth/authRoutes";
import adminRoutes from "./admin/index";
import commonRoutes from "./common/index";
import customerRoutes from "./customer/index";
import { parsing } from "../config/parseMulter";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";
const router = Router();

// Auth Routes
router.use("/auth", parsing, authRoutes);

// Admin Routes
router.use("/admin", adminMiddleware, adminRoutes);

// Common Routes
router.use("/", authMiddleware, commonRoutes);

//  Customer Routes
router.use("/customer", authMiddleware, customerRoutes);

export default router;
