import { Router } from "express";
import {
  cancelMyHelpOffer,
  createHelpOffer,
  getMyHelpOfferById,
  listMyHelpOffers
} from "../controllers/help-offer.controller";
import {
  CancelMyHelpOfferDto,
  CreateHelpOfferDto,
  ListMyHelpOffersQueryDto
} from "../dtos/help-offer.dto";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import {
  validateDto,
  validateQueryDto
} from "../middlewares/validate-dto.middleware";
import { UserRole } from "../constants/enums";

const router = Router();

router.use(authMiddleware, authorizeRoles(UserRole.USER));

router.post("/", validateDto(CreateHelpOfferDto), createHelpOffer);
router.get("/my", validateQueryDto(ListMyHelpOffersQueryDto), listMyHelpOffers);
router.get("/my/:id", getMyHelpOfferById);
router.patch("/my/:id/cancel", validateDto(CancelMyHelpOfferDto), cancelMyHelpOffer);

export default router;
