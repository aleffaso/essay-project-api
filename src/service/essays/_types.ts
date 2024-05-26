import { SpecificationType, StatusType } from "../../entities/essay/Enum";
import { Essay } from "../../entities/essay/Essay";
import { EssayTag } from "../../entities/essay/EssayTag";
import { EssayUpdate } from "../../entities/essay/EssayUpdate";
import { Tag } from "../../entities/essay/Tag";
import { User } from "../../entities/user/User";

export type EssayType = {
  id: string;
  specification: SpecificationType;
  title: string;
  text: string;
  uploadedLink: string;
  status: StatusType;
  author: User;
  updates: EssayUpdate[];
  tags: EssayTag[];
};

export type EssayCreateType = Partial<Omit<EssayType, "id">> & {
  updates?: EssayUpdate[];
  tags?: EssayTag[];
};

export type EssayUpdateType = Partial<Omit<EssayType, "id">> & {
  updates: EssayUpdate[];
  tags: EssayTag[];
};

export type EssayIdType = Pick<EssayType, "id">;

export type EssayTagType = {
  id: string;
  essay: Essay;
  tag: Tag;
};

export type EssayTagCreateType = Partial<Omit<EssayTagType, "id">> & {
  essay: Essay;
  tag: Tag;
};

export type EssayTagUpdateType = Partial<Omit<EssayTagType, "id">> & {
  essay?: Essay;
  tag?: Tag;
};

export type EssayTagIdType = Pick<EssayTagType, "id">;

export type EssayUpdatesType = {
  id: string;
  annotations: string;
  corrections: string;
  comments: string;
  user: User;
  essay: Essay;
};

export type EssayUpdatesCreateType = Partial<Omit<EssayUpdatesType, "id">> & {
  annotations?: string;
  corrections?: string;
  comments?: string;
  user: User;
  essay: Essay;
};

export type EssayUpdatesUpdateType = EssayUpdatesCreateType;

export type EssayUpdatesIdType = Pick<EssayUpdatesType, "id">;

export type FindUserPermission = {
  permissions: { type: string }[];
};
