import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { User } from "./User";
import { Essay } from "./Essay";

@Entity("essay_updates")
export class EssayUpdate {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ type: "text", nullable: true })
  annotations: string;

  @Column({ type: "text", nullable: true })
  corrections: string;

  @Column({ type: "text", nullable: true })
  comments: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Essay)
  essay: Essay;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
