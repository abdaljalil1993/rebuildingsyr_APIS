import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RequestEntity } from "./Request";
import { ServiceField } from "./ServiceField";

@Entity({ name: "services" })
export class ServiceEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 120, unique: true })
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @OneToMany(() => ServiceField, (field) => field.service)
  fields!: ServiceField[];

  @OneToMany(() => RequestEntity, (request) => request.service)
  requests!: RequestEntity[];
}