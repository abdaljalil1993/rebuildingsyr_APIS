import { Request, Response } from "express";
import { LoginDto, RegisterDto } from "../dtos/auth.dto";
import { AuthService } from "../services/auth.service";
import { asyncHandler } from "../utils/async-handler";

const authService = new AuthService();

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body as RegisterDto);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: result
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body as LoginDto);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Logout successful. Remove token on client side."
  });
});
