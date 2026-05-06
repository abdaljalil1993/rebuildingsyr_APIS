import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Media } from "../entities/Media";

export class MediaRepository {
  private readonly repository: Repository<Media>;

  constructor() {
    this.repository = AppDataSource.getRepository(Media);
  }

  create(data: Partial<Media>): Media {
    return this.repository.create(data);
  }

  save(media: Media): Promise<Media> {
    return this.repository.save(media);
  }

  findByRequestId(requestId: number): Promise<Media[]> {
    return this.repository.find({ where: { requestId } });
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete({ id });
  }
}
