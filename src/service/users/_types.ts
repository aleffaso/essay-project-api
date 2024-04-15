import { UserPermission } from "../../entities/user/UserPermission";

export type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive?: boolean;
  permissions: UserPermission[];
};

export type UserCreateType = Omit<UserType, "id"> & {
  password: string;
};

export type UserUpdateType = Partial<UserType> & {
  password?: string;
  permissions?: UserPermission[];
};

export type UserRequestType = {
  email: string;
  password: string;
};

export type UserResponseType = Omit<UserType, "password">;

export type UserIdType = {
  id: string;
};

export type FindUserPermission = {
  permissions: { type: string }[];
};
