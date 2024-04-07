import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { EssayUpdate } from "./EssayUpdate";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  admin: boolean;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ nullable: false, default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => EssayUpdate, (essayUpdate) => essayUpdate.essay)
  updates: EssayUpdate[];

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
