import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ServiceFieldType } from "../constants/enums";
import { RequestData } from "./RequestData";
import { ServiceEntity } from "./Service";

@Entity({ name: "service_fields" })
export class ServiceField {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  serviceId!: number;

  @ManyToOne(() => ServiceEntity, (service) => service.fields, {
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "serviceId" })
  service!: ServiceEntity;

  @Column({ type: "varchar", length: 120 })
  fieldName!: string;

  @Column({ type: "enum", enum: ServiceFieldType })
  fieldType!: ServiceFieldType;

  @Column({ type: "boolean", default: false })
  required!: boolean;

  @OneToMany(() => RequestData, (requestData) => requestData.field)
  requestData!: RequestData[];
}