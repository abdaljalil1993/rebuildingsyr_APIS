import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { ServiceField } from "../entities/ServiceField";

export class ServiceFieldRepository {
  private readonly repository: Repository<ServiceField>;

  constructor() {
    this.repository = AppDataSource.getRepository(ServiceField);
  }

  create(data: Partial<ServiceField>): ServiceField {
    return this.repository.create(data);
  }

  save(field: ServiceField): Promise<ServiceField> {
    return this.repository.save(field);
  }

  findById(id: number): Promise<ServiceField | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByServiceId(serviceId: number): Promise<ServiceField[]> {
    return this.repository.find({ where: { serviceId }, order: { id: "ASC" } });
  }

  findAll(serviceId?: number): Promise<ServiceField[]> {
    if (serviceId) {
      return this.findByServiceId(serviceId);
    }

    return this.repository.find({ order: { id: "ASC" } });
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete({ id });
  }
}
