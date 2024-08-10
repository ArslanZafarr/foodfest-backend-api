import { Router } from "express";
import authRoutes from "./auth/authRoutes";
import { parsing } from "../config/parseMulter";
const router = Router();

router.use("/auth", parsing, authRoutes);

export default router;
