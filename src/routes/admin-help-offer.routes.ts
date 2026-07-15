import { Router } from "express";
import {
  getAdminHelpOfferById,
  listAdminHelpOffers,
  updateHelpOfferStatusByAdmin
} from "../controllers/admin-help-offer.controller";
import {
  ListAdminHelpOffersQueryDto,
  UpdateHelpOfferStatusByAdminDto
} from "../dtos/help-offer.dto";
import { UserRole } from "../constants/enums";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import {
  validateDto,
  validateQueryDto
} from "../middlewares/validate-dto.middleware";

const router = Router();

router.use(authMiddleware, authorizeRoles(UserRole.ADMIN));

router.get("/", validateQueryDto(ListAdminHelpOffersQueryDto), listAdminHelpOffers);
router.get("/:id", getAdminHelpOfferById);
router.patch(
  "/:id/status",
  validateDto(UpdateHelpOfferStatusByAdminDto),
  updateHelpOfferStatusByAdmin
);

export default router;
