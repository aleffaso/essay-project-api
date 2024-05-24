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
import { User } from "../user/User";
import { EssayUpdate } from "./EssayUpdate";
import { EssayTag } from "./EssayTag";
import { StatusType, TestType } from "./Enum";

@Entity("essays")
export class Essay {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({
    type: "enum",
    enum: TestType,
    nullable: false,
    default: TestType.OTHER,
  })
  testType: TestType;

  @Column({ nullable: false, type: "varchar" })
  title: string;

  @Column({ nullable: false, type: "text" })
  text: string;

  @Column({ nullable: true, type: "varchar" })
  essayUploadedLink: string;

  @Column({
    type: "enum",
    enum: StatusType,
    nullable: false,
    default: StatusType.PENDING,
  })
  status: StatusType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.essays, { nullable: false }) // Each Essay belongs to one User
  author: User;

  @OneToMany(() => EssayUpdate, (essayUpdate) => essayUpdate.essay) // Each Essay has many essay updates
  updates: EssayUpdate[];

  @OneToMany(() => EssayTag, (essayTag) => essayTag.essay) // Each Essay can have many tags
  tags: EssayTag[];

  constructor(
    title: string,
    text: string,
    essayUploadedLink: string,
    status: StatusType,
    author: User
  ) {
    this.title = title;
    this.text = text;
    this.essayUploadedLink = essayUploadedLink;
    this.status = status;
    this.author = author;
    if (!this.id) {
      this.id = uuid();
    }
  }
}
