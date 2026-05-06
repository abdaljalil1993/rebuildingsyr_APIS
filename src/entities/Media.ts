import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { MediaType } from "../constants/enums";
import { RequestEntity } from "./Request";

@Entity({ name: "media" })
export class Media {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  requestId!: number;

  @ManyToOne(() => RequestEntity, (request) => request.media, {
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "requestId" })
  request!: RequestEntity;

  @Column({ type: "varchar", length: 255 })
  filePath!: string;

  @Column({ type: "enum", enum: MediaType })
  type!: MediaType;

  @CreateDateColumn({ type: "datetime" })
  uploadedAt!: Date;
}
