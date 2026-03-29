import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";
import { AccountType } from "../constants/enums";
import { RequestEntity } from "./Request";

@Entity({ name: "users" })
@Unique(["email"])
@Unique(["username"])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 150 })
  name!: string;

  @Column({ type: "varchar", length: 30 })
  phone!: string;

  @Column({ type: "varchar", length: 150 })
  email!: string;

  @Column({ type: "varchar", length: 50 })
  username!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "varchar", length: 50 })
  nationalId!: string;

  @Column({ type: "varchar", length: 100 })
  city!: string;

  @Column({ type: "varchar", length: 100 })
  socialStatus!: string;

  @Column({ type: "int" })
  familyMembersNumber!: number;

  @Column({ type: "enum", enum: AccountType, default: AccountType.USER })
  accountType!: AccountType;

  @OneToMany(() => RequestEntity, (request) => request.user)
  requests!: RequestEntity[];
}
