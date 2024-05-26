import { Essay } from "../../entities/essay/Essay";
import { UserPermission } from "../../entities/user/UserPermission";

export type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive?: boolean;
  permissions: UserPermission[];
  essays?: Essay[];
};

export type UserCreateType = Omit<UserType, "id"> & {
  password: string;
};

export type UserUpdateType = Partial<Omit<UserType, "id">> & {
  password?: string;
  permissions?: UserPermission[];
};

export type UserResponseType = Omit<UserType, "password">;

export type UserIdType = Pick<UserType, "id">;

export type UserAuthenticationRequestType = {
  email: string;
  password: string;
};

export type FindUserPermission = {
  permissions: { type: string }[];
};
