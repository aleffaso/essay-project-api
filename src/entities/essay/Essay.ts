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
import { SpecificationType, TagType, StatusType } from "./Enum";

@Entity("essays")
export class Essay {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({
    type: "enum",
    enum: SpecificationType,
    nullable: false,
    default: SpecificationType.OTHER,
  })
  specification: SpecificationType;

  @Column({
    type: "enum",
    enum: TagType,
    nullable: false,
    default: TagType.EDUCATION,
  })
  tag: TagType;

  @Column({ nullable: false, type: "varchar" })
  title: string;

  @Column({ nullable: false, type: "text" })
  text: string;

  @Column({ nullable: true, type: "varchar" })
  uploadedLink: string;

  @Column({
    type: "enum",
    enum: StatusType,
    nullable: false,
    default: StatusType.PENDING,
  })
  status: StatusType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.essays, { nullable: false }) // Each Essay belongs to one User
  author: User;

  @OneToMany(() => EssayUpdate, (essayUpdate) => essayUpdate.essay, {
    cascade: true,
  }) // Each Essay has many essay updates
  updates: EssayUpdate[];

  constructor(
    specification: SpecificationType,
    title: string,
    text: string,
    uploadedLink: string,
    author: User,
    updates: EssayUpdate[]
  ) {
    this.specification = specification;
    this.title = title;
    this.text = text;
    this.uploadedLink = uploadedLink;
    this.author = author;
    this.updates = updates;
    if (!this.id) {
      this.id = uuid();
    }
  }
}
