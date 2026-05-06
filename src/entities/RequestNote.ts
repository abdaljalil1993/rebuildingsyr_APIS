import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RequestEntity } from "./Request";
import { User } from "./User";

@Entity({ name: "request_notes" })
export class RequestNote {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  requestId!: number;

  @ManyToOne(() => RequestEntity, (request) => request.notes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "requestId" })
  request!: RequestEntity;

  @Column({ type: "int" })
  reviewerId!: number;

  @ManyToOne(() => User, (user) => user.reviewerNotes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "reviewerId" })
  reviewer!: User;

  @Column({ type: "text" })
  note!: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;
}