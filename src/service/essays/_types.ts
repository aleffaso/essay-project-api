import {
  SpecificationType,
  StatusType,
  TagType,
} from "../../entities/essay/Enum";
import { UserType } from "../users/_types";

export type EssayUpdate = {
  id: string;
  grade: number | undefined;
  annotations: string;
  corrections: string;
  comments: string;
  createdAt: Date;
  updatedAt: Date;
};

export type EssayType = {
  id: string;
  tag: TagType;
  specification: SpecificationType;
  title: string;
  text: string;
  uploadedLink: string;
  status: StatusType;
  author: UserType;
  updatesCount: number;
  updates: EssayUpdate[];
};

export type EssayCreateType = Partial<Omit<EssayType, "id">> & {
  updates?: EssayUpdate[];
};

export type EssayUpdateType = EssayCreateType;

export type EssayIdType = Pick<EssayType, "id">;
