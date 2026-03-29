import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env";
import { User } from "../entities/User";
import { RequestEntity } from "../entities/Request";
import { DamageReport } from "../entities/DamageReport";
import { Media } from "../entities/Media";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  entities: [User, RequestEntity, DamageReport, Media],
  synchronize: env.db.synchronize,
//   logging: env.nodeEnv === "development",
  subscribers: []
});
