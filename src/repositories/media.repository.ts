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
}
