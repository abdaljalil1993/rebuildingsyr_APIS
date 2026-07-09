import { Request, Response } from "express";
import { UpdateMyProfileDto } from "../dtos/user.dto";
import { UserService } from "../services/user.service";
import { asyncHandler } from "../utils/async-handler";

const userService = new UserService();

export const updateMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const user = await userService.updateMyProfile(
    userId,
    req.body as UpdateMyProfileDto
  );

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user
  });
});
