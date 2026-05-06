import { Router } from "express";
import {
  createService,
  createServiceField,
  createUser,
  deleteService,
  deleteServiceField,
  deleteUser,
  getRequestById,
  getStatistics,
  listAllRequests,
  listServiceFields,
  listServices,
  listUsers,
  updateService,
  updateServiceField,
  updateUser,
  updateRequestStatus
} from "../controllers/admin.controller";
import { UserRole } from "../constants/enums";
import {
  ListRequestsQueryDto,
  UpdateRequestStatusDto
} from "../dtos/request.dto";
import {
  CreateServiceDto,
  CreateServiceFieldDto,
  ListServiceFieldsQueryDto,
  UpdateServiceDto,
  UpdateServiceFieldDto
} from "../dtos/service.dto";
import {
  CreateUserByAdminDto,
  ListUsersQueryDto,
  UpdateUserByAdminDto
} from "../dtos/user.dto";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import {
  validateDto,
  validateQueryDto
} from "../middlewares/validate-dto.middleware";

const router = Router();

router.use(authMiddleware, authorizeRoles(UserRole.ADMIN));

router.get("/users", validateQueryDto(ListUsersQueryDto), listUsers);
router.post("/users", validateDto(CreateUserByAdminDto), createUser);
router.patch("/users/:id", validateDto(UpdateUserByAdminDto), updateUser);
router.delete("/users/:id", deleteUser);

router.get("/services", listServices);
router.post("/services", validateDto(CreateServiceDto), createService);
router.patch("/services/:id", validateDto(UpdateServiceDto), updateService);
router.delete("/services/:id", deleteService);

router.post("/service-fields", validateDto(CreateServiceFieldDto), createServiceField);
router.get("/service-fields", validateQueryDto(ListServiceFieldsQueryDto), listServiceFields);
router.patch("/service-fields/:id", validateDto(UpdateServiceFieldDto), updateServiceField);
router.delete("/service-fields/:id", deleteServiceField);

router.get("/requests", validateQueryDto(ListRequestsQueryDto), listAllRequests);
router.get("/requests/:id", getRequestById);
router.patch(
  "/requests/:id/status",
  validateDto(UpdateRequestStatusDto),
  updateRequestStatus
);
router.get("/statistics", getStatistics);

export default router;
