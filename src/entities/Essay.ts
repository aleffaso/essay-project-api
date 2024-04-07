import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { Student } from "./Student";
import { EssayUpdate } from "./EssayUpdate";

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

  @Column({ nullable: false, default: "pending" })
  status: string;

  @Column({ nullable: true })
  tags: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Student, (student) => student.essays)
  student: Student;

  @OneToMany(() => EssayUpdate, (essayUpdate) => essayUpdate.essay)
  updates: EssayUpdate[];

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
