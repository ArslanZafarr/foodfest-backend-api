import { Router } from "express";
import userRoutes from "./user/userRoutes";
import restaurantRoutes from "./restaurant/restaurantRoutest";

const router = Router();

router.use("/users", userRoutes);
router.use("/restaurants", restaurantRoutes);

export default router;
