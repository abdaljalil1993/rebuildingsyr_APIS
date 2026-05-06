import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { UserRole } from "../constants/enums";

export class UserRepository {
  private readonly repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  create(data: Partial<User>): User {
    return this.repository.create(data);
  }

  save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  findById(id: number): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  findForLogin(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findPaginated(
    page: number,
    limit: number,
    query?: string,
    role?: UserRole
  ): Promise<[User[], number]> {
    const qb = this.repository
      .createQueryBuilder("user")
      .orderBy("user.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    if (role) {
      qb.andWhere("user.role = :role", { role });
    }

    if (query) {
      qb.andWhere("(user.name LIKE :query OR user.email LIKE :query OR user.city LIKE :query)", {
        query: `%${query}%`
      });
    }

    return qb.getManyAndCount();
  }

  async updateRole(id: number, role: UserRole): Promise<void> {
    await this.repository.update({ id }, { role });
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete({ id });
  }

  countAll(): Promise<number> {
    return this.repository.count();
  }
}
