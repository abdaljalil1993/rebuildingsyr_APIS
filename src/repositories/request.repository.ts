import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { RequestEntity } from "../entities/Request";
import { RequestStatus } from "../constants/enums";

interface RequestFilters {
  status?: RequestStatus;
  serviceId?: number;
  city?: string;
  search?: string;
}

export class RequestRepository {
  private readonly repository: Repository<RequestEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(RequestEntity);
  }

  create(data: Partial<RequestEntity>): RequestEntity {
    return this.repository.create(data);
  }

  save(request: RequestEntity): Promise<RequestEntity> {
    return this.repository.save(request);
  }

  async updateById(requestId: number, data: Partial<RequestEntity>): Promise<void> {
    await this.repository.update({ id: requestId }, data);
  }

  remove(request: RequestEntity): Promise<RequestEntity> {
    return this.repository.remove(request);
  }

  async delete(requestId: number): Promise<void> {
    await this.repository.delete({ id: requestId });
  }

  findById(id: number): Promise<RequestEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: [
        "user",
        "service",
        "assignedReviewer",
        "data",
        "data.field",
        "notes",
        "media"
      ]
    });
  }

  async findAllPaginated(
    page: number,
    limit: number,
    filters: RequestFilters
  ): Promise<[RequestEntity[], number]> {
    const qb = this.repository
      .createQueryBuilder("request")
      .leftJoinAndSelect("request.user", "user")
      .leftJoinAndSelect("request.service", "service")
      .leftJoinAndSelect("request.assignedReviewer", "assignedReviewer")
      .leftJoinAndSelect("request.notes", "notes")
      .leftJoinAndSelect("request.data", "data")
      .leftJoinAndSelect("data.field", "field")
      .leftJoinAndSelect("request.media", "media")
      .orderBy("request.id", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .distinct(true);

    if (filters.status) {
      qb.andWhere("request.status = :status", { status: filters.status });
    }

    if (filters.serviceId) {
      qb.andWhere("request.serviceId = :serviceId", { serviceId: filters.serviceId });
    }

    if (filters.city) {
      qb.andWhere("user.city = :city", { city: filters.city });
    }

    if (filters.search) {
      qb.andWhere(
        "(user.name LIKE :search OR service.name LIKE :search)",
        { search: `%${filters.search}%` }
      );
    }

    return qb.getManyAndCount();
  }

  async findByUserPaginated(
    userId: number,
    page: number,
    limit: number,
    filters: RequestFilters
  ): Promise<[RequestEntity[], number]> {
    const where: {
      userId: number;
      status?: RequestStatus;
      serviceId?: number;
    } = { userId };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.serviceId) {
      where.serviceId = filters.serviceId;
    }

    return this.repository.findAndCount({
      where,
      relations: [
        "user",
        "service",
        "assignedReviewer",
        "data",
        "data.field",
        "notes",
        "media"
      ],
      order: { id: "DESC" },
      skip: (page - 1) * limit,
      take: limit
    });
  }

  async findReviewerPaginated(
    reviewerId: number,
    page: number,
    limit: number,
    filters: RequestFilters,
    mode: "assigned" | "all"
  ): Promise<[RequestEntity[], number]> {
    const qb = this.repository
      .createQueryBuilder("request")
      .leftJoinAndSelect("request.user", "user")
      .leftJoinAndSelect("request.service", "service")
      .leftJoinAndSelect("request.assignedReviewer", "assignedReviewer")
      .leftJoinAndSelect("request.notes", "notes")
      .leftJoinAndSelect("request.data", "data")
      .leftJoinAndSelect("data.field", "field")
      .leftJoinAndSelect("request.media", "media")
      .orderBy("request.id", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .distinct(true);

    if (mode === "assigned") {
      qb.andWhere("request.assignedReviewerId = :reviewerId", { reviewerId });
    }

    if (filters.status) {
      qb.andWhere("request.status = :status", { status: filters.status });
    }

    if (filters.serviceId) {
      qb.andWhere("request.serviceId = :serviceId", { serviceId: filters.serviceId });
    }

    if (filters.city) {
      qb.andWhere("user.city = :city", { city: filters.city });
    }

    if (filters.search) {
      qb.andWhere(
        "(user.name LIKE :search OR service.name LIKE :search)",
        { search: `%${filters.search}%` }
      );
    }

    return qb.getManyAndCount();
  }

  async countByStatus(): Promise<Array<{ status: RequestStatus; total: string }>> {
    return this.repository
      .createQueryBuilder("request")
      .select("request.status", "status")
      .addSelect("COUNT(request.id)", "total")
      .groupBy("request.status")
      .getRawMany();
  }

  countAll(): Promise<number> {
    return this.repository.count();
  }
}
