import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { RequestEntity } from "./Request";

@Entity({ name: "media" })
export class Media {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  reqId!: number;

  @ManyToOne(() => RequestEntity, (request) => request.media, {
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "reqId" })
  request!: RequestEntity;

  @Column({ type: "varchar", length: 255 })
  filePath!: string;
}
