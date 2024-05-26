import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { Essay } from "./Essay";
import { Tag } from "./Tag";

@Entity("essay-tags")
export class EssayTag {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @ManyToOne(() => Essay, (essay) => essay.tags, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "essay_id" })
  essay: Essay;

  @ManyToOne(() => Tag, (tag) => tag.essayTags, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "tag_id" })
  tag: Tag;

  constructor(essay: Essay, tag: Tag) {
    this.essay = essay;
    this.tag = tag;
    if (!this.id) {
      this.id = uuid();
    }
  }
}
