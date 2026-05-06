import {
  CreateRequestNoteDto,
  ReviewerListRequestsQueryDto,
  UpdateRequestStatusDto
} from "../dtos/request.dto";
import { RequestStatus } from "../constants/enums";
import { RequestNoteRepository } from "../repositories/request-note.repository";
import { RequestRepository } from "../repositories/request.repository";
import { ApiError } from "../utils/api-error";
import { buildPaginationMeta, getPagination } from "../utils/pagination";

export class ReviewerService {
  private readonly requestRepository: RequestRepository;
  private readonly requestNoteRepository: RequestNoteRepository;

  constructor() {
    this.requestRepository = new RequestRepository();
    this.requestNoteRepository = new RequestNoteRepository();
  }

  async listRequests(reviewerId: number, query: ReviewerListRequestsQueryDto) {
    const { page, limit } = getPagination(query);
    const mode = query.mode === "all" ? "all" : "assigned";

    const [items, total] = await this.requestRepository.findReviewerPaginated(
      reviewerId,
      page,
      limit,
      {
        status: query.status,
        serviceId: query.serviceId,
        city: query.city,
        search: query.search
      },
      mode
    );

    return {
      data: items,
      meta: buildPaginationMeta(page, limit, total)
    };
  }

  async updateRequestStatus(
    reviewerId: number,
    requestId: number,
    payload: UpdateRequestStatusDto
  ) {
    const request = await this.requestRepository.findById(requestId);

    if (!request) {
      throw new ApiError(404, "Request not found");
    }

    if (request.assignedReviewerId && request.assignedReviewerId !== reviewerId) {
      throw new ApiError(403, "Request is assigned to another reviewer");
    }

    if (!request.assignedReviewerId) {
      request.assignedReviewerId = reviewerId;
    }

    if (payload.status === RequestStatus.REJECTED && !payload.rejectionReason) {
      throw new ApiError(400, "Rejection reason is required when status is REJECTED");
    }

    if (payload.status !== RequestStatus.REJECTED) {
      request.rejectionReason = null;
    }

    request.status = payload.status;
    request.rejectionReason = payload.rejectionReason ?? request.rejectionReason;

    await this.requestRepository.save(request);
    const hydrated = await this.requestRepository.findById(request.id);

    if (!hydrated) {
      throw new ApiError(500, "Failed to load updated request");
    }

    return hydrated;
  }

  async addNote(reviewerId: number, requestId: number, payload: CreateRequestNoteDto) {
    const request = await this.requestRepository.findById(requestId);

    if (!request) {
      throw new ApiError(404, "Request not found");
    }

    const note = this.requestNoteRepository.create({
      requestId,
      reviewerId,
      note: payload.note
    });

    await this.requestNoteRepository.save(note);

    if (request.status === RequestStatus.PENDING) {
      request.status = RequestStatus.UNDER_REVIEW;
      request.assignedReviewerId = request.assignedReviewerId ?? reviewerId;
      await this.requestRepository.save(request);
    }

    return note;
  }
}
