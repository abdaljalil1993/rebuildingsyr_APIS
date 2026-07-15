import { HelpOfferStatus, RequestStatus } from "../constants/enums";
import {
  CancelMyHelpOfferDto,
  CreateHelpOfferDto,
  ListAdminHelpOffersQueryDto,
  ListMyHelpOffersQueryDto,
  UpdateHelpOfferStatusByAdminDto
} from "../dtos/help-offer.dto";
import { HelpOfferRepository } from "../repositories/help-offer.repository";
import { RequestRepository } from "../repositories/request.repository";
import { ApiError } from "../utils/api-error";
import { buildPaginationMeta, getPagination } from "../utils/pagination";

export class HelpOfferService {
  private readonly helpOfferRepository: HelpOfferRepository;
  private readonly requestRepository: RequestRepository;

  constructor() {
    this.helpOfferRepository = new HelpOfferRepository();
    this.requestRepository = new RequestRepository();
  }

  async createHelpOffer(helperUserId: number, payload: CreateHelpOfferDto) {
    const request = await this.requestRepository.findById(payload.requestId);

    if (!request) {
      throw new ApiError(404, "Request not found");
    }

    if (request.status !== RequestStatus.APPROVED) {
      throw new ApiError(400, "You can only offer help for approved requests");
    }

    if (request.userId === helperUserId) {
      throw new ApiError(400, "You cannot offer help for your own request");
    }

    const hasActiveOffer = await this.helpOfferRepository.hasActiveOfferForRequest(
      helperUserId,
      payload.requestId
    );

    if (hasActiveOffer) {
      throw new ApiError(409, "You already have an active help offer for this request");
    }

    const offer = this.helpOfferRepository.create({
      helperUserId,
      requestId: payload.requestId,
      status: HelpOfferStatus.NEW,
      message: payload.message ?? null
    });

    const saved = await this.helpOfferRepository.save(offer);
    const hydrated = await this.helpOfferRepository.findById(saved.id);

    if (!hydrated) {
      throw new ApiError(500, "Failed to load created help offer");
    }

    return hydrated;
  }

  async listMyHelpOffers(helperUserId: number, query: ListMyHelpOffersQueryDto) {
    const { page, limit } = getPagination(query);
    const [items, total] = await this.helpOfferRepository.findMyPaginated(
      helperUserId,
      page,
      limit,
      {
        status: query.status,
        requestId: query.requestId,
        search: query.search
      }
    );

    return {
      data: items,
      meta: buildPaginationMeta(page, limit, total)
    };
  }

  async getMyHelpOfferById(helperUserId: number, offerId: number) {
    const offer = await this.helpOfferRepository.findById(offerId);

    if (!offer) {
      throw new ApiError(404, "Help offer not found");
    }

    if (offer.helperUserId !== helperUserId) {
      throw new ApiError(403, "You are not allowed to view this help offer");
    }

    return offer;
  }

  async cancelMyHelpOffer(
    helperUserId: number,
    offerId: number,
    payload: CancelMyHelpOfferDto
  ) {
    const offer = await this.helpOfferRepository.findById(offerId);

    if (!offer) {
      throw new ApiError(404, "Help offer not found");
    }

    if (offer.helperUserId !== helperUserId) {
      throw new ApiError(403, "You are not allowed to cancel this help offer");
    }

    if (offer.status === HelpOfferStatus.CANCELED) {
      throw new ApiError(400, "Help offer is already canceled");
    }

    if (offer.status === HelpOfferStatus.COMPLETED || offer.status === HelpOfferStatus.REJECTED) {
      throw new ApiError(400, "Completed or rejected help offers cannot be canceled");
    }

    offer.status = HelpOfferStatus.CANCELED;
    offer.cancelReason = payload.cancelReason ?? null;

    await this.helpOfferRepository.save(offer);
    const hydrated = await this.helpOfferRepository.findById(offer.id);

    if (!hydrated) {
      throw new ApiError(500, "Failed to load canceled help offer");
    }

    return hydrated;
  }

  async listAdminHelpOffers(query: ListAdminHelpOffersQueryDto) {
    const { page, limit } = getPagination(query);
    const [items, total] = await this.helpOfferRepository.findAdminPaginated(page, limit, {
      status: query.status,
      requestId: query.requestId,
      helperUserId: query.helperUserId,
      city: query.city,
      search: query.search
    });

    return {
      data: items,
      meta: buildPaginationMeta(page, limit, total)
    };
  }

  async getAdminHelpOfferById(offerId: number) {
    const offer = await this.helpOfferRepository.findById(offerId);

    if (!offer) {
      throw new ApiError(404, "Help offer not found");
    }

    return offer;
  }

  async updateHelpOfferStatusByAdmin(
    adminId: number,
    offerId: number,
    payload: UpdateHelpOfferStatusByAdminDto
  ) {
    const offer = await this.helpOfferRepository.findById(offerId);

    if (!offer) {
      throw new ApiError(404, "Help offer not found");
    }

    offer.status = payload.status;
    offer.followedByAdminId = adminId;

    if (payload.adminNote !== undefined) {
      offer.adminNote = payload.adminNote;
    }

    if (payload.status === HelpOfferStatus.COMPLETED) {
      offer.completedAt = new Date();
    } else {
      offer.completedAt = null;
    }

    await this.helpOfferRepository.save(offer);
    const hydrated = await this.helpOfferRepository.findById(offer.id);

    if (!hydrated) {
      throw new ApiError(500, "Failed to load updated help offer");
    }

    return hydrated;
  }
}
