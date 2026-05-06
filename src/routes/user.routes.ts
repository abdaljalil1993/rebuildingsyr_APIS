import { Router } from "express";
import { listServices } from "../controllers/admin.controller";
import { UserRole } from "../constants/enums";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.use(authMiddleware, authorizeRoles(UserRole.USER));

router.get("/services", listServices);

export default router;
