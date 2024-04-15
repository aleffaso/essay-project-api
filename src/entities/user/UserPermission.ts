import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("user-permissions")
export class UserPermission {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ nullable: false })
  type: string;

  constructor(type: string) {
    this.type = type;
    if (!this.id) {
      this.id = uuid();
    }
  }
}
