import { Request, Response } from "express";
import {
  CreateDamageReportDto,
  ListRequestsQueryDto,
  UpdateRequestStatusDto
} from "../dtos/request.dto";
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

export const reviewRequest = asyncHandler(async (req: Request, res: Response) => {
  const requestId = Number(req.params.id);
  const report = await adminService.reviewRequest(
    requestId,
    req.body as CreateDamageReportDto
  );

  res.status(201).json({
    success: true,
    message: "Request reviewed successfully",
    data: report
  });
});

export const getStatistics = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await adminService.getStatistics();

  res.status(200).json({
    success: true,
    data: stats
  });
});
