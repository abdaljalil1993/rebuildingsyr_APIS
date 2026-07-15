import { Repository } from "typeorm";
import { HelpOfferStatus } from "../constants/enums";
import { AppDataSource } from "../config/data-source";
import { HelpOffer } from "../entities/HelpOffer";

interface HelpOfferFilters {
  status?: HelpOfferStatus;
  requestId?: number;
  helperUserId?: number;
  city?: string;
  search?: string;
}

export class HelpOfferRepository {
  private readonly repository: Repository<HelpOffer>;

  constructor() {
    this.repository = AppDataSource.getRepository(HelpOffer);
  }

  create(data: Partial<HelpOffer>): HelpOffer {
    return this.repository.create(data);
  }

  save(item: HelpOffer): Promise<HelpOffer> {
    return this.repository.save(item);
  }

  findById(id: number): Promise<HelpOffer | null> {
    return this.repository.findOne({
      where: { id },
      relations: [
        "helper",
        "followedByAdmin",
        "request",
        "request.user",
        "request.service"
      ]
    });
  }

  async hasActiveOfferForRequest(helperUserId: number, requestId: number): Promise<boolean> {
    const activeStatuses = [
      HelpOfferStatus.NEW,
      HelpOfferStatus.CONTACTED,
      HelpOfferStatus.IN_PROGRESS
    ];

    const count = await this.repository
      .createQueryBuilder("helpOffer")
      .where("helpOffer.helperUserId = :helperUserId", { helperUserId })
      .andWhere("helpOffer.requestId = :requestId", { requestId })
      .andWhere("helpOffer.status IN (:...activeStatuses)", { activeStatuses })
      .getCount();

    return count > 0;
  }

  async findMyPaginated(
    helperUserId: number,
    page: number,
    limit: number,
    filters: HelpOfferFilters
  ): Promise<[HelpOffer[], number]> {
    const qb = this.repository
      .createQueryBuilder("helpOffer")
      .leftJoinAndSelect("helpOffer.helper", "helper")
      .leftJoinAndSelect("helpOffer.followedByAdmin", "followedByAdmin")
      .leftJoinAndSelect("helpOffer.request", "request")
      .leftJoinAndSelect("request.user", "requestUser")
      .leftJoinAndSelect("request.service", "requestService")
      .where("helpOffer.helperUserId = :helperUserId", { helperUserId })
      .orderBy("helpOffer.id", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .distinct(true);

    if (filters.status) {
      qb.andWhere("helpOffer.status = :status", { status: filters.status });
    }

    if (filters.requestId) {
      qb.andWhere("helpOffer.requestId = :requestId", { requestId: filters.requestId });
    }

    if (filters.search) {
      qb.andWhere("(requestUser.name LIKE :search OR requestService.name LIKE :search)", {
        search: `%${filters.search}%`
      });
    }

    return qb.getManyAndCount();
  }

  async findAdminPaginated(
    page: number,
    limit: number,
    filters: HelpOfferFilters
  ): Promise<[HelpOffer[], number]> {
    const qb = this.repository
      .createQueryBuilder("helpOffer")
      .leftJoinAndSelect("helpOffer.helper", "helper")
      .leftJoinAndSelect("helpOffer.followedByAdmin", "followedByAdmin")
      .leftJoinAndSelect("helpOffer.request", "request")
      .leftJoinAndSelect("request.user", "requestUser")
      .leftJoinAndSelect("request.service", "requestService")
      .orderBy("helpOffer.id", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .distinct(true);

    if (filters.status) {
      qb.andWhere("helpOffer.status = :status", { status: filters.status });
    }

    if (filters.requestId) {
      qb.andWhere("helpOffer.requestId = :requestId", { requestId: filters.requestId });
    }

    if (filters.helperUserId) {
      qb.andWhere("helpOffer.helperUserId = :helperUserId", {
        helperUserId: filters.helperUserId
      });
    }

    if (filters.city) {
      qb.andWhere("requestUser.city = :city", { city: filters.city });
    }

    if (filters.search) {
      qb.andWhere(
        "(helper.name LIKE :search OR requestUser.name LIKE :search OR requestService.name LIKE :search)",
        { search: `%${filters.search}%` }
      );
    }

    return qb.getManyAndCount();
  }
}
