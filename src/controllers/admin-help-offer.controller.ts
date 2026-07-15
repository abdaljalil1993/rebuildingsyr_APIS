import { Request, Response } from "express";
import {
  ListAdminHelpOffersQueryDto,
  UpdateHelpOfferStatusByAdminDto
} from "../dtos/help-offer.dto";
import { HelpOfferService } from "../services/help-offer.service";
import { asyncHandler } from "../utils/async-handler";

const helpOfferService = new HelpOfferService();

export const listAdminHelpOffers = asyncHandler(async (req: Request, res: Response) => {
  const result = await helpOfferService.listAdminHelpOffers(
    req.query as unknown as ListAdminHelpOffersQueryDto
  );

  res.status(200).json({
    success: true,
    ...result
  });
});

export const getAdminHelpOfferById = asyncHandler(async (req: Request, res: Response) => {
  const offerId = Number(req.params.id);
  const data = await helpOfferService.getAdminHelpOfferById(offerId);

  res.status(200).json({
    success: true,
    data
  });
});

export const updateHelpOfferStatusByAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const offerId = Number(req.params.id);
    const data = await helpOfferService.updateHelpOfferStatusByAdmin(
      req.user!.id,
      offerId,
      req.body as UpdateHelpOfferStatusByAdminDto
    );

    res.status(200).json({
      success: true,
      message: "Help offer status updated successfully",
      data
    });
  }
);
