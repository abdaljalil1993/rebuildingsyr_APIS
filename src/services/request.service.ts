import {
  CreateRequestDto,
  ListRequestsQueryDto,
  UpdateRequestDto
} from "../dtos/request.dto";
import { RequestStatus } from "../constants/enums";
import { MediaRepository } from "../repositories/media.repository";
import { RequestDataRepository } from "../repositories/request-data.repository";
import { RequestRepository } from "../repositories/request.repository";
import { ServiceFieldRepository } from "../repositories/service-field.repository";
import { ServiceRepository } from "../repositories/service.repository";
import { ApiError } from "../utils/api-error";
import { buildPaginationMeta, getPagination } from "../utils/pagination";

export class RequestService {
  private readonly requestRepository: RequestRepository;
  private readonly serviceRepository: ServiceRepository;
  private readonly serviceFieldRepository: ServiceFieldRepository;
  private readonly requestDataRepository: RequestDataRepository;
  private readonly mediaRepository: MediaRepository;

  constructor() {
    this.requestRepository = new RequestRepository();
    this.serviceRepository = new ServiceRepository();
    this.serviceFieldRepository = new ServiceFieldRepository();
    this.requestDataRepository = new RequestDataRepository();
    this.mediaRepository = new MediaRepository();
  }

  private validatePayloadAgainstFields(
    fieldIds: number[],
    payloadFieldIds: number[]
  ): void {
    const allowed = new Set(fieldIds);
    const invalid = payloadFieldIds.filter((fieldId) => !allowed.has(fieldId));

    if (invalid.length > 0) {
      throw new ApiError(
        400,
        `Invalid field ids for selected service: ${invalid.join(", ")}`
      );
    }
  }

  private ensureRequiredFieldsProvided(
    requiredFieldIds: number[],
    payloadFieldIds: number[]
  ): void {
    const submitted = new Set(payloadFieldIds);
    const missing = requiredFieldIds.filter((requiredFieldId) => !submitted.has(requiredFieldId));

    if (missing.length > 0) {
      throw new ApiError(
        400,
        `Missing required service field ids: ${missing.join(", ")}`
      );
    }
  }

  async createRequest(userId: number, payload: CreateRequestDto) {
    const service = await this.serviceRepository.findById(payload.serviceId);

    if (!service) {
      throw new ApiError(404, "Service not found");
    }

    const serviceFields = await this.serviceFieldRepository.findByServiceId(payload.serviceId);
    const serviceFieldIds = serviceFields.map((field) => field.id);
    const requiredFieldIds = serviceFields
      .filter((field) => field.required)
      .map((field) => field.id);
    const payloadFieldIds = payload.data.map((item) => item.fieldId);

    this.validatePayloadAgainstFields(serviceFieldIds, payloadFieldIds);
    this.ensureRequiredFieldsProvided(requiredFieldIds, payloadFieldIds);

    const request = this.requestRepository.create({
      userId,
      serviceId: payload.serviceId,
      status: RequestStatus.PENDING
    });

    const savedRequest = await this.requestRepository.save(request);

    const requestDataEntities = this.requestDataRepository.createMany(
      payload.data.map((item) => ({
        requestId: savedRequest.id,
        fieldId: item.fieldId,
        value: item.value
      }))
    );

    await this.requestDataRepository.saveMany(requestDataEntities);

    if (payload.media?.length) {
      for (const mediaItem of payload.media) {
        const media = this.mediaRepository.create({
          requestId: savedRequest.id,
          filePath: mediaItem.filePath,
          type: mediaItem.type
        });
        await this.mediaRepository.save(media);
      }
    }

    const hydrated = await this.requestRepository.findById(savedRequest.id);

    if (!hydrated) {
      throw new ApiError(500, "Failed to load created request");
    }

    return hydrated;
  }

  async updateRequest(userId: number, requestId: number, payload: UpdateRequestDto) {
    const request = await this.requestRepository.findById(requestId);

    if (!request) {
      throw new ApiError(404, "Request not found");
    }

    if (request.userId !== userId) {
      throw new ApiError(403, "You are not allowed to update this request");
    }

    if (
      request.status !== RequestStatus.PENDING &&
      request.status !== RequestStatus.NEEDS_INFO
    ) {
      throw new ApiError(
        400,
        "Request can only be updated when status is PENDING or NEEDS_INFO"
      );
    }

    if (payload.data && payload.data.length > 0) {
      const serviceFields = await this.serviceFieldRepository.findByServiceId(
        request.serviceId
      );
      const serviceFieldIds = serviceFields.map((field) => field.id);
      const payloadFieldIds = payload.data.map((item) => item.fieldId);
      this.validatePayloadAgainstFields(serviceFieldIds, payloadFieldIds);

      await this.requestDataRepository.deleteByRequestId(request.id);
      const requestDataEntities = this.requestDataRepository.createMany(
        payload.data.map((item) => ({
          requestId: request.id,
          fieldId: item.fieldId,
          value: item.value
        }))
      );
      await this.requestDataRepository.saveMany(requestDataEntities);
    }

    request.status = RequestStatus.PENDING;
    request.rejectionReason = null;
    await this.requestRepository.updateById(request.id, {
      status: RequestStatus.PENDING,
      rejectionReason: null
    });

    const hydrated = await this.requestRepository.findById(request.id);

    if (!hydrated) {
      throw new ApiError(500, "Failed to load updated request");
    }

    return hydrated;
  }

  async deleteRequest(userId: number, requestId: number) {
    const request = await this.requestRepository.findById(requestId);

    if (!request) {
      throw new ApiError(404, "Request not found");
    }

    if (request.userId !== userId) {
      throw new ApiError(403, "You are not allowed to delete this request");
    }

    if (request.status === RequestStatus.APPROVED) {
      throw new ApiError(400, "Approved requests cannot be deleted");
    }

    await this.requestRepository.delete(request.id);
  }

  async listMyRequests(userId: number, query: ListRequestsQueryDto) {
    const { page, limit, skip } = getPagination(query);
    const [items, total] = await this.requestRepository.findByUserPaginated(
      userId,
      page,
      limit,
      {
        status: query.status,
        serviceId: query.serviceId,
        search: query.search
      }
    );

    return {
      data: items,
      meta: buildPaginationMeta(page, limit, total)
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
}
