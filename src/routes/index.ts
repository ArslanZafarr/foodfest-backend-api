import { Router } from "express";
import authRoutes from "./auth/authRoutes";
import commonRoutes from "./common/index";
import customerRoutes from "./customer/index";
import { parsing } from "../config/parseMulter";
import { authMiddleware } from "../middleware/authMiddleware";
const router = Router();

// Auth Routes
router.use("/auth", parsing, authRoutes);

// Common Routes
router.use("/",  authMiddleware,commonRoutes);

//  Customer Routes
router.use("/customer", authMiddleware, customerRoutes);

export default router;
