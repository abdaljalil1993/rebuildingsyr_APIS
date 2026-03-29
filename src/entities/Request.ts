import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { RequestStatus, RequestType } from "../constants/enums";
import { User } from "./User";
import { DamageReport } from "./DamageReport";
import { Media } from "./Media";

@Entity({ name: "requests" })
export class RequestEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  userId!: number;

  @ManyToOne(() => User, (user) => user.requests, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ type: "enum", enum: RequestType })
  reqType!: RequestType;

  @Column({ type: "datetime" })
  reqDate!: Date;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "boolean", default: false })
  withDocs!: boolean;

  @Column({ type: "enum", enum: RequestStatus, default: RequestStatus.PENDING })
  status!: RequestStatus;

  @Column({ type: "varchar", length: 100 })
  buildingNumber!: string;

  @OneToMany(() => DamageReport, (damageReport) => damageReport.request)
  damageReports!: DamageReport[];

  @OneToMany(() => Media, (media) => media.request)
  media!: Media[];
}
