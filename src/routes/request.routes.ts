import { Router } from "express";
import {
  createRequest,
  deleteRequest,
  getMyRequestById,
  listMyRequests,
  updateRequest,
  uploadDocument
} from "../controllers/request.controller";
import { AccountType } from "../constants/enums";
import {
  CreateRequestDto,
  ListRequestsQueryDto,
  UpdateRequestDto
} from "../dtos/request.dto";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { upload } from "../middlewares/upload.middleware";
import {
  validateDto,
  validateQueryDto
} from "../middlewares/validate-dto.middleware";

const router = Router();

router.use(authMiddleware, authorizeRoles(AccountType.USER));

router.post("/", validateDto(CreateRequestDto), createRequest);
router.get("/", validateQueryDto(ListRequestsQueryDto), listMyRequests);
router.get("/:id", getMyRequestById);
router.patch("/:id", validateDto(UpdateRequestDto), updateRequest);
router.delete("/:id", deleteRequest);
router.post("/:id/documents", upload.single("document"), uploadDocument);

export default router;
