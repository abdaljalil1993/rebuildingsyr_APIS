import { Router } from "express";
import { listServices } from "../controllers/admin.controller";
import { UserRole } from "../constants/enums";
import { updateMyProfile } from "../controllers/user.controller";
import { UpdateMyProfileDto } from "../dtos/user.dto";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validateDto } from "../middlewares/validate-dto.middleware";

const router = Router();

router.use(authMiddleware, authorizeRoles(UserRole.USER));

router.get("/services", listServices);
router.patch("/profile", validateDto(UpdateMyProfileDto), updateMyProfile);

export default router;
