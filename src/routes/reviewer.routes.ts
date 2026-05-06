import { Router } from "express";
import {
  addReviewerNote,
  listReviewerRequests,
  updateReviewerRequestStatus
} from "../controllers/reviewer.controller";
import { UserRole } from "../constants/enums";
import {
  CreateRequestNoteDto,
  ReviewerListRequestsQueryDto,
  UpdateRequestStatusDto
} from "../dtos/request.dto";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import {
  validateDto,
  validateQueryDto
} from "../middlewares/validate-dto.middleware";

const router = Router();

router.use(authMiddleware, authorizeRoles(UserRole.REVIEWER, UserRole.ADMIN));

router.get("/requests", validateQueryDto(ReviewerListRequestsQueryDto), listReviewerRequests);
router.patch(
  "/requests/:id/status",
  validateDto(UpdateRequestStatusDto),
  updateReviewerRequestStatus
);
router.post("/requests/:id/note", validateDto(CreateRequestNoteDto), addReviewerNote);

export default router;
