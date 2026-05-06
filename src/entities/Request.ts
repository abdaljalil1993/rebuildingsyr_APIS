import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { RequestStatus } from "../constants/enums";
import { User } from "./User";
import { ServiceEntity } from "./Service";
import { RequestData } from "./RequestData";
import { RequestNote } from "./RequestNote";
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

  @Column({ type: "int" })
  serviceId!: number;

  @ManyToOne(() => ServiceEntity, (service) => service.requests, {
    onDelete: "RESTRICT"
  })
  @JoinColumn({ name: "serviceId" })
  service!: ServiceEntity;

  @Column({ type: "int", nullable: true })
  assignedReviewerId!: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "assignedReviewerId" })
  assignedReviewer!: User | null;

  @Column({ type: "varchar", length: 1000, nullable: true })
  rejectionReason!: string | null;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;

  @Column({ type: "enum", enum: RequestStatus, default: RequestStatus.PENDING })
  status!: RequestStatus;

  @OneToMany(() => RequestData, (requestData) => requestData.request, {
    cascade: true
  })
  data!: RequestData[];

  @OneToMany(() => RequestNote, (note) => note.request, { cascade: true })
  notes!: RequestNote[];

  @OneToMany(() => Media, (media) => media.request)
  media!: Media[];
}
