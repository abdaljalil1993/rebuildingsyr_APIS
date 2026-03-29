import { Repository, SelectQueryBuilder } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { RequestEntity } from "../entities/Request";
import { RequestStatus, RequestType } from "../constants/enums";

interface RequestFilters {
  status?: RequestStatus;
  type?: RequestType;
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

  remove(request: RequestEntity): Promise<RequestEntity> {
    return this.repository.remove(request);
  }

  findById(id: number): Promise<RequestEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["user", "damageReports", "media"]
    });
  }

  private applyFilters(
    qb: SelectQueryBuilder<RequestEntity>,
    filters: RequestFilters
  ): SelectQueryBuilder<RequestEntity> {
    if (filters.status) {
      qb.andWhere("request.status = :status", { status: filters.status });
    }

    if (filters.type) {
      qb.andWhere("request.reqType = :reqType", { reqType: filters.type });
    }

    if (filters.city) {
      qb.andWhere("user.city = :city", { city: filters.city });
    }

    if (filters.search) {
      qb.andWhere(
        "(request.description LIKE :search OR request.buildingNumber LIKE :search OR user.name LIKE :search)",
        { search: `%${filters.search}%` }
      );
    }

    return qb;
  }

  async findAllPaginated(
    page: number,
    limit: number,
    filters: RequestFilters
  ): Promise<[RequestEntity[], number]> {
    const qb = this.repository
      .createQueryBuilder("request")
      .leftJoinAndSelect("request.user", "user")
      .leftJoinAndSelect("request.damageReports", "damageReports")
      .leftJoinAndSelect("request.media", "media")
      .orderBy("request.reqDate", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    this.applyFilters(qb, filters);

    return qb.getManyAndCount();
  }

  async findByUserPaginated(
    userId: number,
    page: number,
    limit: number,
    filters: RequestFilters
  ): Promise<[RequestEntity[], number]> {
    const qb = this.repository
      .createQueryBuilder("request")
      .leftJoinAndSelect("request.user", "user")
      .leftJoinAndSelect("request.damageReports", "damageReports")
      .leftJoinAndSelect("request.media", "media")
      .where("request.userId = :userId", { userId })
      .orderBy("request.reqDate", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    this.applyFilters(qb, filters);

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
