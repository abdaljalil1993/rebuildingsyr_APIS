import { Router } from "express";
import { healthCheck } from "../controllers/health.controller";
import adminRoutes from "./admin.routes";
import authRoutes from "./auth.routes";
import reviewerRoutes from "./reviewer.routes";
import requestRoutes from "./request.routes";
import userRoutes from "./user.routes";

const router = Router();

router.get("/health", healthCheck);
router.use("/auth", authRoutes);
router.use("/", userRoutes);
router.use("/requests", requestRoutes);
router.use("/reviewer", reviewerRoutes);
router.use("/admin", adminRoutes);

export default router;
