import { UpdateProfileDto } from "../dtos/user.dto";
import { UserRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/api-error";

export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  async updateProfile(userId: number, payload: UpdateProfileDto) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    Object.assign(user, payload);
    const updatedUser = await this.userRepository.save(user);
    const { password: _password, ...safeUser } = updatedUser;

    return safeUser;
  }
}
