import { Request, Response } from "express";
import {
  CancelMyHelpOfferDto,
  CreateHelpOfferDto,
  ListMyHelpOffersQueryDto
} from "../dtos/help-offer.dto";
import { HelpOfferService } from "../services/help-offer.service";
import { asyncHandler } from "../utils/async-handler";

const helpOfferService = new HelpOfferService();

export const createHelpOffer = asyncHandler(async (req: Request, res: Response) => {
  const data = await helpOfferService.createHelpOffer(
    req.user!.id,
    req.body as CreateHelpOfferDto
  );

  res.status(201).json({
    success: true,
    message: "Help offer submitted successfully",
    data
  });
});

export const listMyHelpOffers = asyncHandler(async (req: Request, res: Response) => {
  const result = await helpOfferService.listMyHelpOffers(
    req.user!.id,
    req.query as unknown as ListMyHelpOffersQueryDto
  );

  res.status(200).json({
    success: true,
    ...result
  });
});

export const getMyHelpOfferById = asyncHandler(async (req: Request, res: Response) => {
  const offerId = Number(req.params.id);
  const data = await helpOfferService.getMyHelpOfferById(req.user!.id, offerId);

  res.status(200).json({
    success: true,
    data
  });
});

export const cancelMyHelpOffer = asyncHandler(async (req: Request, res: Response) => {
  const offerId = Number(req.params.id);
  const data = await helpOfferService.cancelMyHelpOffer(
    req.user!.id,
    offerId,
    req.body as CancelMyHelpOfferDto
  );

  res.status(200).json({
    success: true,
    message: "Help offer canceled successfully",
    data
  });
});
