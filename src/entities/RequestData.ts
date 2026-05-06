import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RequestEntity } from "./Request";
import { ServiceField } from "./ServiceField";

@Entity({ name: "request_data" })
export class RequestData {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  requestId!: number;

  @ManyToOne(() => RequestEntity, (request) => request.data, { onDelete: "CASCADE" })
  @JoinColumn({ name: "requestId" })
  request!: RequestEntity;

  @Column({ type: "int" })
  fieldId!: number;

  @ManyToOne(() => ServiceField, (field) => field.requestData, { onDelete: "CASCADE" })
  @JoinColumn({ name: "fieldId" })
  field!: ServiceField;

  @Column({ type: "text" })
  value!: string;
}