import "reflect-metadata";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { UserPermission } from "./UserPermission";
import { Essay } from "../essay/Essay";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ nullable: false, type: "varchar" })
  firstName: string;

  @Column({ nullable: false, type: "varchar" })
  lastName: string;

  @Column({ nullable: false, type: "varchar" })
  email: string;

  @Column({ nullable: false, type: "varchar" })
  password: string;

  @Column({ nullable: false, default: true, type: "boolean" })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => UserPermission, { nullable: true })
  @JoinTable()
  permissions: UserPermission[];

  @OneToMany(() => Essay, (essay) => essay.author) // Each User can have many Essays
  essays: Essay[];

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    isActive: boolean,
    permissions: UserPermission[],
    essays: Essay[]
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.isActive = isActive;
    this.permissions = permissions;
    this.essays = essays;
    if (!this.id) {
      this.id = uuid();
    }
  }
}
