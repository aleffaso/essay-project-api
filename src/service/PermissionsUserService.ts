import jwt, { JsonWebTokenError } from "jsonwebtoken";

import { KEYS, PERMISSION_LEVELS } from "../constants";
import { AppDataSource } from "../data-source";
import { User as UserTable } from "../entities/user/User";
import { DoesNotExistError } from "../errors";

export async function getPermissions(
  authorization: string,
  serviceClass: string
) {
  try {
    const userRepo = AppDataSource.getRepository(UserTable);
    const { id } = jwt.verify(authorization, KEYS.JWT.USER) as TokenPayload;

    const findUserPermission = await userRepo.findOne({
      where: { id },
      relations: ["permissions"],
    });

    if (!findUserPermission) {
      throw new DoesNotExistError("User not found");
    }

    const userPermissionList = findUserPermission.permissions.map(
      (permission) => permission.type
    );

    const permissionCheckFunction = servicePermissionsMap[serviceClass];
    if (!permissionCheckFunction) {
      throw new Error(
        `Permission check function not found for service class: ${serviceClass}`
      );
    }

    const hasPermissions = permissionCheckFunction(userPermissionList);

    return {
      hasPermissions,
      permissions: userPermissionList,
    };
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new DoesNotExistError("Invalid token");
    }
    throw error;
  }
}

// User service

export const AuthenticateUserServicePermissions = (
  userPermissions: string[]
) => {
  return (
    userPermissions.includes(PERMISSION_LEVELS.ADMIN) ||
    userPermissions.includes(PERMISSION_LEVELS.USER) ||
    userPermissions.includes(PERMISSION_LEVELS.CUSTOMER) ||
    userPermissions.includes(PERMISSION_LEVELS.FINANCIAL) ||
    userPermissions.includes(PERMISSION_LEVELS.SUPPORT) ||
    userPermissions.includes(PERMISSION_LEVELS.DEVELOPER)
  );
};

export const CreateUserServicePermissions = (userPermissions: string[]) => {
  return (
    userPermissions.includes(PERMISSION_LEVELS.ADMIN) ||
    userPermissions.includes(PERMISSION_LEVELS.USER) ||
    userPermissions.includes(PERMISSION_LEVELS.CUSTOMER) ||
    userPermissions.includes(PERMISSION_LEVELS.FINANCIAL) ||
    userPermissions.includes(PERMISSION_LEVELS.SUPPORT) ||
    userPermissions.includes(PERMISSION_LEVELS.DEVELOPER)
  );
};

export const GetUserServicePermissions = (userPermissions: string[]) => {
  return (
    userPermissions.includes(PERMISSION_LEVELS.ADMIN) ||
    userPermissions.includes(PERMISSION_LEVELS.USER) ||
    userPermissions.includes(PERMISSION_LEVELS.CUSTOMER) ||
    userPermissions.includes(PERMISSION_LEVELS.FINANCIAL) ||
    userPermissions.includes(PERMISSION_LEVELS.SUPPORT) ||
    userPermissions.includes(PERMISSION_LEVELS.DEVELOPER)
  );
};

export const DeleteUserServicePermissions = (userPermissions: string[]) => {
  return (
    userPermissions.includes(PERMISSION_LEVELS.ADMIN) ||
    userPermissions.includes(PERMISSION_LEVELS.USER) ||
    userPermissions.includes(PERMISSION_LEVELS.CUSTOMER) ||
    userPermissions.includes(PERMISSION_LEVELS.FINANCIAL) ||
    userPermissions.includes(PERMISSION_LEVELS.SUPPORT) ||
    userPermissions.includes(PERMISSION_LEVELS.DEVELOPER)
  );
};

export const ListUsersServicePermissions = (userPermissions: string[]) => {
  return (
    userPermissions.includes(PERMISSION_LEVELS.ADMIN) ||
    userPermissions.includes(PERMISSION_LEVELS.USER) ||
    //userPermissions.includes(PERMISSION_LEVELS.CUSTOMER) ||
    userPermissions.includes(PERMISSION_LEVELS.FINANCIAL) ||
    userPermissions.includes(PERMISSION_LEVELS.SUPPORT) ||
    userPermissions.includes(PERMISSION_LEVELS.DEVELOPER)
  );
};

export const UpdateUserServicePermissions = (userPermissions: string[]) => {
  return (
    userPermissions.includes(PERMISSION_LEVELS.ADMIN) ||
    userPermissions.includes(PERMISSION_LEVELS.USER) ||
    userPermissions.includes(PERMISSION_LEVELS.CUSTOMER) ||
    userPermissions.includes(PERMISSION_LEVELS.FINANCIAL) ||
    userPermissions.includes(PERMISSION_LEVELS.SUPPORT) ||
    userPermissions.includes(PERMISSION_LEVELS.DEVELOPER)
  );
};

//Permission service

export const CreateUserPermissionsService = (userPermissions: string[]) => {
  return userPermissions.includes(PERMISSION_LEVELS.ADMIN);
};

export const ListUserPermissionsService = (userPermissions: string[]) => {
  return userPermissions.includes(PERMISSION_LEVELS.ADMIN);
};

//Essay service

export const CreateEssayServicePermissions = (userPermissions: string[]) => {
  return (
    userPermissions.includes(PERMISSION_LEVELS.ADMIN) ||
    userPermissions.includes(PERMISSION_LEVELS.USER) ||
    userPermissions.includes(PERMISSION_LEVELS.CUSTOMER) ||
    userPermissions.includes(PERMISSION_LEVELS.FINANCIAL) ||
    userPermissions.includes(PERMISSION_LEVELS.SUPPORT) ||
    userPermissions.includes(PERMISSION_LEVELS.DEVELOPER)
  );
};

export const UpdateEssayServicePermissions = (userPermissions: string[]) => {
  return (
    userPermissions.includes(PERMISSION_LEVELS.ADMIN) ||
    userPermissions.includes(PERMISSION_LEVELS.USER) ||
    userPermissions.includes(PERMISSION_LEVELS.CUSTOMER) ||
    userPermissions.includes(PERMISSION_LEVELS.FINANCIAL) ||
    userPermissions.includes(PERMISSION_LEVELS.SUPPORT) ||
    userPermissions.includes(PERMISSION_LEVELS.DEVELOPER)
  );
};

export const ListEssaysServicePermissions = (userPermissions: string[]) => {
  return (
    userPermissions.includes(PERMISSION_LEVELS.ADMIN) ||
    userPermissions.includes(PERMISSION_LEVELS.USER) ||
    userPermissions.includes(PERMISSION_LEVELS.CUSTOMER) ||
    userPermissions.includes(PERMISSION_LEVELS.FINANCIAL) ||
    userPermissions.includes(PERMISSION_LEVELS.SUPPORT) ||
    userPermissions.includes(PERMISSION_LEVELS.DEVELOPER)
  );
};

export const DeleteEssayServicePermissions = (userPermissions: string[]) => {
  return (
    userPermissions.includes(PERMISSION_LEVELS.ADMIN) ||
    userPermissions.includes(PERMISSION_LEVELS.USER) ||
    userPermissions.includes(PERMISSION_LEVELS.CUSTOMER) ||
    userPermissions.includes(PERMISSION_LEVELS.FINANCIAL) ||
    userPermissions.includes(PERMISSION_LEVELS.SUPPORT) ||
    userPermissions.includes(PERMISSION_LEVELS.DEVELOPER)
  );
};

export const GetEssayServicePermissions = (userPermissions: string[]) => {
  return (
    userPermissions.includes(PERMISSION_LEVELS.ADMIN) ||
    userPermissions.includes(PERMISSION_LEVELS.USER) ||
    userPermissions.includes(PERMISSION_LEVELS.CUSTOMER) ||
    userPermissions.includes(PERMISSION_LEVELS.FINANCIAL) ||
    userPermissions.includes(PERMISSION_LEVELS.SUPPORT) ||
    userPermissions.includes(PERMISSION_LEVELS.DEVELOPER)
  );
};

type ServicePermissionMap = {
  [key: string]: (userPermissions: string[]) => boolean;
};

const servicePermissionsMap: ServicePermissionMap = {
  ListUsersService: ListUsersServicePermissions,
  GetUserService: GetUserServicePermissions,
  CreateUserService: CreateUserServicePermissions,
  UpdateUserService: UpdateUserServicePermissions,
  DeleteUserService: DeleteUserServicePermissions,

  CreateUserPermissionsService: CreateUserPermissionsService,
  ListUserPermissionsService: ListUserPermissionsService,

  CreateEssayService: CreateEssayServicePermissions,
  UpdateEssayService: UpdateEssayServicePermissions,
  ListEssaysService: ListEssaysServicePermissions,
  DeleteEssayService: DeleteEssayServicePermissions,
  GetEssayService: GetEssayServicePermissions,
};
