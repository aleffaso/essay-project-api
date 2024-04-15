// import {
//   Entity,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
//   PrimaryGeneratedColumn,
//   ManyToOne,
//   OneToMany,
//   BeforeInsert,
// } from "typeorm";
// import { v4 as uuid } from "uuid";
// import { User } from "../user/User";
// import { EssayUpdate } from "../essay/EssayUpdate";
// import { StatusType } from "../essay/Enum";

// @Entity("essays")
// export class Essay {
//   @PrimaryGeneratedColumn("uuid")
//   readonly id: string;

//   @Column({ nullable: false })
//   title: string;

//   @Column({ type: "text", nullable: false })
//   text: string;

//   @Column({ nullable: true })
//   essayUploadedLink: string;

//   @Column({ nullable: false, default: "PENDING" })
//   status: string;

//   @Column({ nullable: true })
//   tags: string;

//   @CreateDateColumn()
//   created_at: Date;

//   @UpdateDateColumn()
//   updated_at: Date;

//   @ManyToOne(() => User, (user) => user.essays) // Each Essay belongs to one User
//   author: User;

//   @OneToMany(() => EssayUpdate, (essayUpdate) => essayUpdate.essay) // Each Essay has many essay updates
//   updates: EssayUpdate[];

//   constructor(
//     title: string,
//     text: string,
//     essayUploadedLink: string,
//     status: string,
//     tags: string,
//     author: User,
//     updates: EssayUpdate[]
//   ) {
//     this.title = title;
//     this.text = text;
//     this.essayUploadedLink = essayUploadedLink;
//     this.status = status;
//     this.tags = tags;
//     this.author = author;
//     this.updates = updates;
//     if (!this.id) {
//       this.id = uuid();
//     }
//   }

//   @BeforeInsert()
//   validateStatus() {
//     if (!this.status) {
//       throw new Error("Essay must have a status.");
//     }

//     const validStatus: string[] = Object.values(StatusType).map(
//       (status) => status
//     );

//     if (!validStatus.includes(this.status)) {
//       throw new Error("Invalid status type.");
//     }
//   }
// }
