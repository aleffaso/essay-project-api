// import {
//   Entity,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
//   PrimaryGeneratedColumn,
//   ManyToOne,
// } from "typeorm";
// import { v4 as uuid } from "uuid";
// import { User } from "../user/User";
// import { Essay } from "../essay/Essay";

// @Entity("essay_updates")
// export class EssayUpdate {
//   @PrimaryGeneratedColumn("uuid")
//   readonly id: string;

//   @Column({ type: "text", nullable: true })
//   annotations: string;

//   @Column({ type: "text", nullable: true })
//   corrections: string;

//   @Column({ type: "text", nullable: true })
//   comments: string;

//   @CreateDateColumn()
//   created_at: Date;

//   @UpdateDateColumn()
//   updated_at: Date;

//   @ManyToOne(() => User, (user) => user.essayUpdates) // Each essay update belongs to one user
//   user: User;

//   @ManyToOne(() => Essay, (essay) => essay.author) // Each essay update belongs to one essay
//   essay: Essay;

//   constructor(
//     annotations: string,
//     corrections: string,
//     comments: string,
//     user: User,
//     essay: Essay
//   ) {
//     this.annotations = annotations;
//     this.corrections = corrections;
//     this.comments = comments;
//     this.user = user;
//     this.essay = essay;
//     if (!this.id) {
//       this.id = uuid();
//     }
//   }
// }
