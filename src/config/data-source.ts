import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env";
import { User } from "../entities/User";
import { RequestEntity } from "../entities/Request";
import { Media } from "../entities/Media";
import { ServiceEntity } from "../entities/Service";
import { ServiceField } from "../entities/ServiceField";
import { RequestData } from "../entities/RequestData";
import { RequestNote } from "../entities/RequestNote";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  entities: [
    User,
    ServiceEntity,
    ServiceField,
    RequestEntity,
    RequestData,
    RequestNote,
    Media
  ],
  synchronize: env.db.synchronize,
  logging: env.nodeEnv === "development",
  subscribers: []
});
