import { UpdateMyProfileDto } from "../dtos/user.dto";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/api-error";

const sanitizeUser = (user: User) => {
  const { password: _password, ...safeUser } = user;
  return safeUser;
};

export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async updateMyProfile(userId: number, payload: UpdateMyProfileDto) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (payload.email && payload.email !== user.email) {
      const existing = await this.userRepository.findByEmail(payload.email);

      if (existing && existing.id !== user.id) {
        throw new ApiError(409, "Email is already in use");
      }
    }

    Object.assign(user, payload);
    const updated = await this.userRepository.save(user);

    return sanitizeUser(updated);
  }
}
