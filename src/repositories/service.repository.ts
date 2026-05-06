import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { ServiceEntity } from "../entities/Service";

export class ServiceRepository {
  private readonly repository: Repository<ServiceEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ServiceEntity);
  }

  create(data: Partial<ServiceEntity>): ServiceEntity {
    return this.repository.create(data);
  }

  save(service: ServiceEntity): Promise<ServiceEntity> {
    return this.repository.save(service);
  }

  findAll(): Promise<ServiceEntity[]> {
    return this.repository.find({ relations: ["fields"], order: { id: "ASC" } });
  }

  findById(id: number): Promise<ServiceEntity | null> {
    return this.repository.findOne({ where: { id }, relations: ["fields"] });
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete({ id });
  }
}
