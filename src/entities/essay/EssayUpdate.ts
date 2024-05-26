import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { User } from "../user/User";
import { Essay } from "./Essay";

@Entity("essay-updates")
export class EssayUpdate {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ nullable: true, type: "text" })
  annotations: string;

  @Column({ nullable: true, type: "text" })
  corrections: string;

  @Column({ nullable: true, type: "text" })
  comments: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { nullable: false }) // Each update is made by one User
  user: User;

  @ManyToOne(() => Essay, (essay) => essay.updates, { nullable: false }) // Each update belongs to one Essay
  essay: Essay;

  constructor(
    annotations: string,
    corrections: string,
    comments: string,
    user: User,
    essay: Essay
  ) {
    this.annotations = annotations;
    this.corrections = corrections;
    this.comments = comments;
    this.user = user;
    this.essay = essay;
    if (!this.id) {
      this.id = uuid();
    }
  }
}
