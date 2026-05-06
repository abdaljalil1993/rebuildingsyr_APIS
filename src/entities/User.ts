import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";
import { UserRole } from "../constants/enums";
import { RequestEntity } from "./Request";
import { RequestNote } from "./RequestNote";

@Entity({ name: "users" })
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 150 })
  name!: string;

  @Column({ type: "varchar", length: 30 })
  phone!: string;

  @Column({ type: "varchar", length: 150 })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "varchar", length: 100 })
  city!: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @OneToMany(() => RequestEntity, (request) => request.user)
  requests!: RequestEntity[];

  @OneToMany(() => RequestNote, (note) => note.reviewer)
  reviewerNotes!: RequestNote[];
}
