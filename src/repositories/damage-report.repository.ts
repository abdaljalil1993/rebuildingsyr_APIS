import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { DamageReport } from "../entities/DamageReport";

export class DamageReportRepository {
  private readonly repository: Repository<DamageReport>;

  constructor() {
    this.repository = AppDataSource.getRepository(DamageReport);
  }

  create(data: Partial<DamageReport>): DamageReport {
    return this.repository.create(data);
  }

  save(report: DamageReport): Promise<DamageReport> {
    return this.repository.save(report);
  }
}
