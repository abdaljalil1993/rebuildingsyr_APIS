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
import { RequestRepository } from "../repositories/request.repository";
import { ServiceFieldRepository } from "../repositories/service-field.repository";
import { ServiceRepository } from "../repositories/service.repository";
import { UserRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/api-error";
import { buildPaginationMeta, getPagination } from "../utils/pagination";
import { hashPassword } from "../utils/password";

export class AdminService {
  private readonly requestRepository: RequestRepository;
  private readonly userRepository: UserRepository;
  private readonly serviceRepository: ServiceRepository;
  private readonly serviceFieldRepository: ServiceFieldRepository;

  constructor() {
    this.requestRepository = new RequestRepository();
    this.userRepository = new UserRepository();
    this.serviceRepository = new ServiceRepository();
    this.serviceFieldRepository = new ServiceFieldRepository();
  }

  async listRequests(query: ListRequestsQueryDto) {
    const { page, limit } = getPagination(query);
    const [items, total] = await this.requestRepository.findAllPaginated(
      page,
      limit,
      {
        status: query.status,
        serviceId: query.serviceId,
        city: query.city,
        search: query.search
      }
    );

    return {
      data: items,
      meta: buildPaginationMeta(page, limit, total)
    };
  }

  async getRequestById(requestId: number) {
    const request = await this.requestRepository.findById(requestId);

    if (!request) {
      throw new ApiError(404, "Request not found");
    }

    return request;
  }

  async updateRequestStatus(requestId: number, payload: UpdateRequestStatusDto) {
    const request = await this.requestRepository.findById(requestId);

    if (!request) {
      throw new ApiError(404, "Request not found");
    }

    request.status = payload.status;
    request.rejectionReason = payload.rejectionReason ?? null;
    return this.requestRepository.save(request);
  }

  async listUsers(query: ListUsersQueryDto) {
    const { page, limit } = getPagination(query);
    const [users, total] = await this.userRepository.findPaginated(
      page,
      limit,
      query.search,
      query.role
    );

    return {
      data: users.map((user) => {
        const { password: _password, ...safe } = user;
        return safe;
      }),
      meta: buildPaginationMeta(page, limit, total)
    };
  }

  async createUser(payload: CreateUserByAdminDto) {
    const existing = await this.userRepository.findByEmail(payload.email);

    if (existing) {
      throw new ApiError(409, "Email is already in use");
    }

    const password = await hashPassword(payload.password);
    const user = this.userRepository.create({ ...payload, password });
    const saved = await this.userRepository.save(user);
    const { password: _password, ...safe } = saved;
    return safe;
  }

  async updateUser(userId: number, payload: UpdateUserByAdminDto) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    Object.assign(user, payload);
    const updated = await this.userRepository.save(user);
    const { password: _password, ...safe } = updated;
    return safe;
  }

  async deleteUser(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    await this.userRepository.deleteById(userId);
  }

  listServices() {
    return this.serviceRepository.findAll();
  }

  async createService(payload: CreateServiceDto) {
    const service = this.serviceRepository.create(payload);
    return this.serviceRepository.save(service);
  }

  async updateService(serviceId: number, payload: UpdateServiceDto) {
    const service = await this.serviceRepository.findById(serviceId);
    if (!service) {
      throw new ApiError(404, "Service not found");
    }
    Object.assign(service, payload);
    return this.serviceRepository.save(service);
  }

  async deleteService(serviceId: number) {
    const service = await this.serviceRepository.findById(serviceId);
    if (!service) {
      throw new ApiError(404, "Service not found");
    }
    await this.serviceRepository.deleteById(serviceId);
  }

  async createServiceField(payload: CreateServiceFieldDto) {
    const service = await this.serviceRepository.findById(payload.serviceId);
    if (!service) {
      throw new ApiError(404, "Service not found");
    }
    const field = this.serviceFieldRepository.create(payload);
    return this.serviceFieldRepository.save(field);
  }

  listServiceFields(query: ListServiceFieldsQueryDto) {
    return this.serviceFieldRepository.findAll(query.serviceId);
  }

  async updateServiceField(fieldId: number, payload: UpdateServiceFieldDto) {
    const field = await this.serviceFieldRepository.findById(fieldId);
    if (!field) {
      throw new ApiError(404, "Service field not found");
    }
    Object.assign(field, payload);
    return this.serviceFieldRepository.save(field);
  }

  async deleteServiceField(fieldId: number) {
    const field = await this.serviceFieldRepository.findById(fieldId);
    if (!field) {
      throw new ApiError(404, "Service field not found");
    }
    await this.serviceFieldRepository.deleteById(fieldId);
  }

  async getStatistics() {
    const [totalUsers, totalRequests, groupedStatus, services] = await Promise.all([
      this.userRepository.countAll(),
      this.requestRepository.countAll(),
      this.requestRepository.countByStatus(),
      this.serviceRepository.findAll()
    ]);

    return {
      totalUsers,
      totalRequests,
      totalServices: services.length,
      requestsPerStatus: groupedStatus.map((item) => ({
        status: item.status,
        total: Number(item.total)
      }))
    };
  }
}
