import {
  CreateRequestDto,
  ListRequestsQueryDto,
  UpdateRequestDto
} from "../dtos/request.dto";
import { MediaRepository } from "../repositories/media.repository";
import { RequestRepository } from "../repositories/request.repository";
import { ApiError } from "../utils/api-error";
import { buildPaginationMeta, getPagination } from "../utils/pagination";

export class RequestService {
  private readonly requestRepository: RequestRepository;
  private readonly mediaRepository: MediaRepository;

  constructor() {
    this.requestRepository = new RequestRepository();
    this.mediaRepository = new MediaRepository();
  }

  async createRequest(userId: number, payload: CreateRequestDto) {
    const request = this.requestRepository.create({
      userId,
      reqType: payload.reqType,
      reqDate: new Date(payload.reqDate),
      description: payload.description,
      withDocs: payload.withDocs,
      buildingNumber: payload.buildingNumber
    });

    return this.requestRepository.save(request);
  }

  async updateRequest(userId: number, requestId: number, payload: UpdateRequestDto) {
    const request = await this.requestRepository.findById(requestId);

    if (!request) {
      throw new ApiError(404, "Request not found");
    }

    if (request.userId !== userId) {
      throw new ApiError(403, "You are not allowed to update this request");
    }

    if (payload.reqType) {
      request.reqType = payload.reqType;
    }

    if (payload.reqDate) {
      request.reqDate = new Date(payload.reqDate);
    }

    if (payload.description !== undefined) {
      request.description = payload.description;
    }

    if (payload.withDocs !== undefined) {
      request.withDocs = payload.withDocs;
    }

    if (payload.buildingNumber !== undefined) {
      request.buildingNumber = payload.buildingNumber;
    }

    return this.requestRepository.save(request);
  }

  async deleteRequest(userId: number, requestId: number) {
    const request = await this.requestRepository.findById(requestId);

    if (!request) {
      throw new ApiError(404, "Request not found");
    }

    if (request.userId !== userId) {
      throw new ApiError(403, "You are not allowed to delete this request");
    }

    await this.requestRepository.remove(request);
  }

  async listMyRequests(userId: number, query: ListRequestsQueryDto) {
    const { page, limit, skip } = getPagination(query);
    const [items, total] = await this.requestRepository.findByUserPaginated(
      userId,
      page,
      limit,
      {
        status: query.status,
        type: query.type,
        search: query.search
      }
    );

    return {
      data: items,
      meta: buildPaginationMeta(page, limit, total),
      skip
    };
  }

  async getRequestById(userId: number, requestId: number) {
    const request = await this.requestRepository.findById(requestId);

    if (!request) {
      throw new ApiError(404, "Request not found");
    }

    if (request.userId !== userId) {
      throw new ApiError(403, "You are not allowed to view this request");
    }

    return request;
  }

  async uploadDocument(userId: number, requestId: number, filePath: string) {
    const request = await this.requestRepository.findById(requestId);

    if (!request) {
      throw new ApiError(404, "Request not found");
    }

    if (request.userId !== userId) {
      throw new ApiError(403, "You are not allowed to upload documents for this request");
    }

    const media = this.mediaRepository.create({
      reqId: requestId,
      filePath
    });

    request.withDocs = true;

    await Promise.all([
      this.mediaRepository.save(media),
      this.requestRepository.save(request)
    ]);

    return media;
  }
}
