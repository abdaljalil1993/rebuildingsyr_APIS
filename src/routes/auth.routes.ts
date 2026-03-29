import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller";
import { LoginDto, RegisterDto } from "../dtos/auth.dto";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateDto } from "../middlewares/validate-dto.middleware";

const router = Router();

router.post("/register", validateDto(RegisterDto), register);
router.post("/login", validateDto(LoginDto), login);
router.post("/logout", authMiddleware, logout);

export default router;
