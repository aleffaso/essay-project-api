// import { EssayUpdate } from "../../entities/essay/EssayUpdate";
// import { User } from "../../entities/user/User";

// export type EssayType = {
//   id: string;
//   title: string;
//   text: string;
//   essayUploadedLink: string;
//   status: string;
//   tags: string;
//   author: User;
//   updates: EssayUpdate;
// };

// export type EssayCreateType = Omit<
//   EssayType,
//   "id" | "created_at" | "updated_at"
// >;

// export type EssayUpdateType = Partial<
//   Pick<EssayType, "title" | "text" | "essayUploadedLink" | "tags">
// > & {
//   id: string;
// };

// export type EssayIdType = {
//   id: string;
// };
