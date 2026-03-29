import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/user.controller";
import { UpdateProfileDto } from "../dtos/user.dto";
import { AccountType } from "../constants/enums";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validateDto } from "../middlewares/validate-dto.middleware";

const router = Router();

router.use(authMiddleware, authorizeRoles(AccountType.USER));

router.get("/me", getProfile);
router.patch("/me", validateDto(UpdateProfileDto), updateProfile);

export default router;
