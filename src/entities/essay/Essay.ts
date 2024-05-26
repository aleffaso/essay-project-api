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
import { StatusType, SpecificationType } from "./Enum";

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

  @OneToMany(() => EssayUpdate, (essayUpdate) => essayUpdate.essay) // Each Essay has many essay updates
  updates: EssayUpdate[];

  @OneToMany(() => EssayTag, (essayTag) => essayTag.essay) // Each Essay can have many tags
  tags: EssayTag[];

  constructor(
    specification: SpecificationType,
    title: string,
    text: string,
    uploadedLink: string,
    status: StatusType,
    author: User,
    updates: EssayUpdate[],
    tags: EssayTag[]
  ) {
    this.specification = specification;
    this.title = title;
    this.text = text;
    this.uploadedLink = uploadedLink;
    this.status = status;
    this.author = author;
    this.updates = updates;
    this.tags = tags;
    if (!this.id) {
      this.id = uuid();
    }
  }
}
