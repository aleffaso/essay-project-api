import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { v4 as uuid } from "uuid";
import { EssayTag } from "./EssayTag";
import { TagType } from "./Enum";

@Entity("tags")
export class Tag {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({
    type: "enum",
    enum: TagType,
    nullable: false,
    unique: true,
  })
  name: TagType;

  @OneToMany(() => EssayTag, (essayTag) => essayTag.tag) // Each Tag can be associated with many essays
  essayTags: EssayTag[];

  constructor(name: TagType) {
    this.name = name;
    if (!this.id) {
      this.id = uuid();
    }
  }
}
