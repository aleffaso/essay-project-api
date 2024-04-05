import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { v4 as uuid } from "uuid"; //generate random id

@Entity("essays")
export class Essay {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  author: string;

  @Column({ type: "text", nullable: false })
  text: string;

  @Column({ nullable: true })
  amazonLink: string;

  @Column({ type: "text", nullable: true })
  annotations: string;

  @Column({ nullable: false, default: "pending" })
  status: string;

  @Column({ type: "text", nullable: true })
  corrections: string;

  @Column({ nullable: true })
  tags: string;

  @Column({ type: "text", nullable: true })
  comments: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
