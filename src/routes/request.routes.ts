import { Router } from "express";
import {
  createRequest,
  deleteRequest,
  getMyRequestById,
  listMyRequests,
  updateRequest,
  listPublicRequests,
  getPublicRequestById
} from "../controllers/request.controller";
import { UserRole } from "../constants/enums";
import {
  CreateRequestDto,
  ListRequestsQueryDto,
  UpdateRequestDto,
  PublicRequestsQueryDto
} from "../dtos/request.dto";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import {
  validateDto,
  validateQueryDto
} from "../middlewares/validate-dto.middleware";

const router = Router();

// ============ PUBLIC ROUTES (No Authentication Required) ============
router.get("/public", validateQueryDto(PublicRequestsQueryDto), listPublicRequests);
router.get("/public/:id", getPublicRequestById);

// ============ AUTHENTICATED ROUTES ============
router.use(authMiddleware, authorizeRoles(UserRole.USER));

router.post("/", validateDto(CreateRequestDto), createRequest);
router.get("/my", validateQueryDto(ListRequestsQueryDto), listMyRequests);
router.get("/:id", getMyRequestById);
router.patch("/:id", validateDto(UpdateRequestDto), updateRequest);
router.delete("/:id", deleteRequest);

export default router;
