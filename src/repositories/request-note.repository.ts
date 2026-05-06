import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { RequestNote } from "../entities/RequestNote";

export class RequestNoteRepository {
  private readonly repository: Repository<RequestNote>;

  constructor() {
    this.repository = AppDataSource.getRepository(RequestNote);
  }

  create(data: Partial<RequestNote>): RequestNote {
    return this.repository.create(data);
  }

  save(note: RequestNote): Promise<RequestNote> {
    return this.repository.save(note);
  }

  findByRequestId(requestId: number): Promise<RequestNote[]> {
    return this.repository.find({
      where: { requestId },
      relations: ["reviewer"],
      order: { createdAt: "DESC" }
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete({ id });
  }
}
