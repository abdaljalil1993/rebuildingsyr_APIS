import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { HelpOfferStatus } from "../constants/enums";
import { RequestEntity } from "./Request";
import { User } from "./User";

@Entity({ name: "help_offers" })
export class HelpOffer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  requestId!: number;

  @ManyToOne(() => RequestEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "requestId" })
  request!: RequestEntity;

  @Column({ type: "int" })
  helperUserId!: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "helperUserId" })
  helper!: User;

  @Column({ type: "int", nullable: true })
  followedByAdminId!: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "followedByAdminId" })
  followedByAdmin!: User | null;

  @Column({ type: "varchar", length: 1000, nullable: true })
  message!: string | null;

  @Column({ type: "varchar", length: 1000, nullable: true })
  adminNote!: string | null;

  @Column({ type: "varchar", length: 1000, nullable: true })
  cancelReason!: string | null;

  @Column({ type: "datetime", nullable: true })
  completedAt!: Date | null;

  @Column({ type: "enum", enum: HelpOfferStatus, default: HelpOfferStatus.NEW })
  status!: HelpOfferStatus;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
