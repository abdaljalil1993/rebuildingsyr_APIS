import { Request, Response } from "express";
import {
  CreateRequestDto,
  ListRequestsQueryDto,
  UpdateRequestDto,
  PublicRequestsQueryDto
} from "../dtos/request.dto";
import { RequestService } from "../services/request.service";
import { asyncHandler } from "../utils/async-handler";

const requestService = new RequestService();

export const createRequest = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const request = await requestService.createRequest(
    userId,
    req.body as CreateRequestDto
  );

  res.status(201).json({
    success: true,
    message: "Request submitted successfully",
    data: request
  });
});

export const updateRequest = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const requestId = Number(req.params.id);
  const request = await requestService.updateRequest(
    userId,
    requestId,
    req.body as UpdateRequestDto
  );

  res.status(200).json({
    success: true,
    message: "Request updated successfully",
    data: request
  });
});

export const deleteRequest = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const requestId = Number(req.params.id);

  await requestService.deleteRequest(userId, requestId);

  res.status(200).json({
    success: true,
    message: "Request deleted successfully"
  });
});

export const listMyRequests = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const data = await requestService.listMyRequests(
    userId,
    req.query as unknown as ListRequestsQueryDto
  );

  res.status(200).json({
    success: true,
    ...data
  });
});

export const getMyRequestById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const requestId = Number(req.params.id);
  const request = await requestService.getRequestById(userId, requestId);

  res.status(200).json({
    success: true,
    data: request
  });
});

// ============ PUBLIC ENDPOINTS ============

export const listPublicRequests = asyncHandler(async (req: Request, res: Response) => {
  const data = await requestService.listPublicRequests(
    req.query as unknown as PublicRequestsQueryDto
  );

  res.status(200).json({
    success: true,
    ...data
  });
});

export const getPublicRequestById = asyncHandler(async (req: Request, res: Response) => {
  const requestId = Number(req.params.id);
  const request = await requestService.getPublicRequestById(requestId);

  res.status(200).json({
    success: true,
    data: request
  });
});
