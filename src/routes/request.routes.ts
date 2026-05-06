import { Router } from "express";
import {
  createRequest,
  deleteRequest,
  getMyRequestById,
  listMyRequests,
  updateRequest
} from "../controllers/request.controller";
import { UserRole } from "../constants/enums";
import {
  CreateRequestDto,
  ListRequestsQueryDto,
  UpdateRequestDto
} from "../dtos/request.dto";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import {
  validateDto,
  validateQueryDto
} from "../middlewares/validate-dto.middleware";

const router = Router();

router.use(authMiddleware, authorizeRoles(UserRole.USER));

router.post("/", validateDto(CreateRequestDto), createRequest);
router.get("/my", validateQueryDto(ListRequestsQueryDto), listMyRequests);
router.get("/:id", getMyRequestById);
router.patch("/:id", validateDto(UpdateRequestDto), updateRequest);
router.delete("/:id", deleteRequest);

export default router;
