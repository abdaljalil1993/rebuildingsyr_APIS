import { Router } from "express";
import { healthCheck } from "../controllers/health.controller";
import adminHelpOfferRoutes from "./admin-help-offer.routes";
import adminRoutes from "./admin.routes";
import authRoutes from "./auth.routes";
import helpOfferRoutes from "./help-offer.routes";
import reviewerRoutes from "./reviewer.routes";
import requestRoutes from "./request.routes";
import userRoutes from "./user.routes";

const router = Router();

router.get("/health", healthCheck);
router.use("/auth", authRoutes);
router.use("/requests", requestRoutes);
router.use("/help-offers", helpOfferRoutes);
router.use("/reviewer", reviewerRoutes);
router.use("/admin", adminRoutes);
router.use("/admin/help-offers", adminHelpOfferRoutes);
router.use("/", userRoutes);

export default router;
