import { Request, Response } from "express";
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
import { AdminService } from "../services/admin.service";
import { asyncHandler } from "../utils/async-handler";

const adminService = new AdminService();

export const listAllRequests = asyncHandler(async (req: Request, res: Response) => {
  const result = await adminService.listRequests(
    req.query as unknown as ListRequestsQueryDto
  );

  res.status(200).json({
    success: true,
    ...result
  });
});

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await adminService.listUsers(
    req.query as unknown as ListUsersQueryDto
  );

  res.status(200).json({
    success: true,
    ...result
  });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await adminService.createUser(req.body as CreateUserByAdminDto);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user
  });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const user = await adminService.updateUser(
    userId,
    req.body as UpdateUserByAdminDto
  );

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user
  });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  await adminService.deleteUser(userId);

  res.status(200).json({
    success: true,
    message: "User deleted successfully"
  });
});

export const listServices = asyncHandler(async (_req: Request, res: Response) => {
  const data = await adminService.listServices();

  res.status(200).json({
    success: true,
    data
  });
});

export const createService = asyncHandler(async (req: Request, res: Response) => {
  const data = await adminService.createService(req.body as CreateServiceDto);

  res.status(201).json({
    success: true,
    message: "Service created successfully",
    data
  });
});

export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const serviceId = Number(req.params.id);
  const data = await adminService.updateService(
    serviceId,
    req.body as UpdateServiceDto
  );

  res.status(200).json({
    success: true,
    message: "Service updated successfully",
    data
  });
});

export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const serviceId = Number(req.params.id);
  await adminService.deleteService(serviceId);

  res.status(200).json({
    success: true,
    message: "Service deleted successfully"
  });
});

export const createServiceField = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await adminService.createServiceField(
      req.body as CreateServiceFieldDto
    );

    res.status(201).json({
      success: true,
      message: "Service field created successfully",
      data
    });
  }
);

export const listServiceFields = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await adminService.listServiceFields(
      req.query as unknown as ListServiceFieldsQueryDto
    );

    res.status(200).json({
      success: true,
      data
    });
  }
);

export const updateServiceField = asyncHandler(
  async (req: Request, res: Response) => {
    const fieldId = Number(req.params.id);
    const data = await adminService.updateServiceField(
      fieldId,
      req.body as UpdateServiceFieldDto
    );

    res.status(200).json({
      success: true,
      message: "Service field updated successfully",
      data
    });
  }
);

export const deleteServiceField = asyncHandler(
  async (req: Request, res: Response) => {
    const fieldId = Number(req.params.id);
    await adminService.deleteServiceField(fieldId);

    res.status(200).json({
      success: true,
      message: "Service field deleted successfully"
    });
  }
);

export const getRequestById = asyncHandler(async (req: Request, res: Response) => {
  const requestId = Number(req.params.id);
  const request = await adminService.getRequestById(requestId);

  res.status(200).json({
    success: true,
    data: request
  });
});

export const updateRequestStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const requestId = Number(req.params.id);
    const updated = await adminService.updateRequestStatus(
      requestId,
      req.body as UpdateRequestStatusDto
    );

    res.status(200).json({
      success: true,
      message: "Request status updated successfully",
      data: updated
    });
  }
);

export const getStatistics = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await adminService.getStatistics();

  res.status(200).json({
    success: true,
    data: stats
  });
});
