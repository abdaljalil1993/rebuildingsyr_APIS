import { Request, Response } from "express";
import { UpdateProfileDto } from "../dtos/user.dto";
import { UserService } from "../services/user.service";
import { asyncHandler } from "../utils/async-handler";

const userService = new UserService();

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const profile = await userService.getProfile(userId);

  res.status(200).json({
    success: true,
    data: profile
  });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const updated = await userService.updateProfile(
    userId,
    req.body as UpdateProfileDto
  );

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updated
  });
});
