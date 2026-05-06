import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import { LoginDto, RegisterDto } from "../dtos/auth.dto";
import { validateDto } from "../middlewares/validate-dto.middleware";

const router = Router();

router.post("/register", validateDto(RegisterDto), register);
router.post("/login", validateDto(LoginDto), login);

export default router;
