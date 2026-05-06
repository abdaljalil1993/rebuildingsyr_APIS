import { UserRole } from "../constants/enums";
import { LoginDto, RegisterDto } from "../dtos/auth.dto";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/api-error";
import { signToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";

const sanitizeUser = (user: User) => {
  const { password: _password, ...safeUser } = user;
  return safeUser;
};

export class AuthService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(payload: RegisterDto) {
    const existingEmail = await this.userRepository.findByEmail(payload.email);

    if (existingEmail) {
      throw new ApiError(409, "Email is already in use");
    }

    const hashedPassword = await hashPassword(payload.password);
    const user = this.userRepository.create({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      city: payload.city,
      role: UserRole.USER,
      password: hashedPassword
    });

    const savedUser = await this.userRepository.save(user);
    const token = signToken({
      id: savedUser.id,
      role: savedUser.role
    });

    return {
      user: sanitizeUser(savedUser),
      token
    };
  }

  async login(payload: LoginDto) {
    const user = await this.userRepository.findForLogin(payload.email);

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordValid = await comparePassword(payload.password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = signToken({
      id: user.id,
      role: user.role
    });

    return {
      user: sanitizeUser(user),
      token
    };
  }
}
