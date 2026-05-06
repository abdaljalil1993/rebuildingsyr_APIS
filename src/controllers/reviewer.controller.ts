import { Request, Response } from "express";
import {
  CreateRequestNoteDto,
  ReviewerListRequestsQueryDto,
  UpdateRequestStatusDto
} from "../dtos/request.dto";
import { ReviewerService } from "../services/reviewer.service";
import { asyncHandler } from "../utils/async-handler";

const reviewerService = new ReviewerService();

export const listReviewerRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await reviewerService.listRequests(
      req.user!.id,
      req.query as unknown as ReviewerListRequestsQueryDto
    );

    res.status(200).json({
      success: true,
      ...result
    });
  }
);

export const updateReviewerRequestStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const requestId = Number(req.params.id);
    const updated = await reviewerService.updateRequestStatus(
      req.user!.id,
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

export const addReviewerNote = asyncHandler(async (req: Request, res: Response) => {
  const requestId = Number(req.params.id);
  const note = await reviewerService.addNote(
    req.user!.id,
    requestId,
    req.body as CreateRequestNoteDto
  );

  res.status(201).json({
    success: true,
    message: "Note added successfully",
    data: note
  });
});
