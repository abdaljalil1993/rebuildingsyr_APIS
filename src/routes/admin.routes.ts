import { Router } from "express";
import {
  getStatistics,
  listAllRequests,
  reviewRequest,
  updateRequestStatus
} from "../controllers/admin.controller";
import { AccountType } from "../constants/enums";
import {
  CreateDamageReportDto,
  ListRequestsQueryDto,
  UpdateRequestStatusDto
} from "../dtos/request.dto";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import {
  validateDto,
  validateQueryDto
} from "../middlewares/validate-dto.middleware";

const router = Router();

router.use(authMiddleware, authorizeRoles(AccountType.ADMIN));

router.get("/requests", validateQueryDto(ListRequestsQueryDto), listAllRequests);
router.patch(
  "/requests/:id/status",
  validateDto(UpdateRequestStatusDto),
  updateRequestStatus
);
router.post("/requests/:id/review", validateDto(CreateDamageReportDto), reviewRequest);
router.get("/statistics", getStatistics);

export default router;
