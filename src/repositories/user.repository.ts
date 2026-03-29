import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";

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

  findByUsername(username: string): Promise<User | null> {
    return this.repository.findOne({ where: { username } });
  }

  findByIdentifier(identifier: string): Promise<User | null> {
    return this.repository
      .createQueryBuilder("user")
      .where("user.email = :identifier", { identifier })
      .orWhere("user.username = :identifier", { identifier })
      .getOne();
  }

  countAll(): Promise<number> {
    return this.repository.count();
  }
}
