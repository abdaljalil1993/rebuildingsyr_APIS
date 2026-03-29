import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { RequestEntity } from "./Request";

@Entity({ name: "damage_reports" })
export class DamageReport {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  reqId!: number;

  @ManyToOne(() => RequestEntity, (request) => request.damageReports, {
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "reqId" })
  request!: RequestEntity;

  @Column({ type: "varchar", length: 150 })
  reportBy!: string;

  @Column({ type: "datetime" })
  reportDate!: Date;

  @Column({ type: "text" })
  description!: string;
}
