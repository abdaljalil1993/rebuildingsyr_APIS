import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { RequestData } from "../entities/RequestData";

export class RequestDataRepository {
  private readonly repository: Repository<RequestData>;

  constructor() {
    this.repository = AppDataSource.getRepository(RequestData);
  }

  createMany(data: Array<Partial<RequestData>>): RequestData[] {
    return this.repository.create(data);
  }

  saveMany(data: RequestData[]): Promise<RequestData[]> {
    return this.repository.save(data);
  }

  async deleteByRequestId(requestId: number): Promise<void> {
    await this.repository.delete({ requestId });
  }
}
