import {
  CreateDamageReportDto,
  ListRequestsQueryDto,
  UpdateRequestStatusDto
} from "../dtos/request.dto";
import { RequestStatus } from "../constants/enums";
import { DamageReportRepository } from "../repositories/damage-report.repository";
import { RequestRepository } from "../repositories/request.repository";
import { UserRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/api-error";
import { buildPaginationMeta, getPagination } from "../utils/pagination";

export class AdminService {
  private readonly requestRepository: RequestRepository;
  private readonly userRepository: UserRepository;
  private readonly damageReportRepository: DamageReportRepository;

  constructor() {
    this.requestRepository = new RequestRepository();
    this.userRepository = new UserRepository();
    this.damageReportRepository = new DamageReportRepository();
  }

  async listRequests(query: ListRequestsQueryDto) {
    const { page, limit } = getPagination(query);
    const [items, total] = await this.requestRepository.findAllPaginated(
      page,
      limit,
      {
        status: query.status,
        type: query.type,
        city: query.city,
        search: query.search
      }
    );

    return {
      data: items,
      meta: buildPaginationMeta(page, limit, total)
    };
  }

  async updateRequestStatus(requestId: number, payload: UpdateRequestStatusDto) {
    const request = await this.requestRepository.findById(requestId);

    if (!request) {
      throw new ApiError(404, "Request not found");
    }

    request.status = payload.status;
    return this.requestRepository.save(request);
  }

  async reviewRequest(requestId: number, payload: CreateDamageReportDto) {
    const request = await this.requestRepository.findById(requestId);

    if (!request) {
      throw new ApiError(404, "Request not found");
    }

    const report = this.damageReportRepository.create({
      reqId: requestId,
      reportBy: payload.reportBy,
      reportDate: new Date(payload.reportDate),
      description: payload.description
    });

    if (request.status === RequestStatus.PENDING) {
      request.status = RequestStatus.UNDER_REVIEW;
    }

    await Promise.all([
      this.damageReportRepository.save(report),
      this.requestRepository.save(request)
    ]);

    return report;
  }

  async getStatistics() {
    const [totalUsers, totalRequests, groupedStatus] = await Promise.all([
      this.userRepository.countAll(),
      this.requestRepository.countAll(),
      this.requestRepository.countByStatus()
    ]);

    return {
      totalUsers,
      totalRequests,
      requestsPerStatus: groupedStatus.map((item) => ({
        status: item.status,
        total: Number(item.total)
      }))
    };
  }
}
