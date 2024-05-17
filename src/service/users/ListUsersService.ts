import { AppDataSource } from "../../data-source";

import { User as UserTable } from "../../entities/user/User";
import { DoesNotExistError, ForbiddenError } from "../../errors";
import { getPermissions } from "../PermissionsUserService";
import { UserResponseType } from "./_types";

export class ListUsersService {
  async execute(authorization: any, page: number, limit: number) {
    try {
      const permissionsResult = await getPermissions(
        authorization,
        this.constructor.name
      );

      if (!permissionsResult.hasPermissions) {
        throw new ForbiddenError("You do not have permission");
      }

      const userRepo = AppDataSource.getRepository(UserTable);

      const offset = (page - 1) * limit;
      const users = await userRepo.find({
        select: [
          "id",
          "firstName",
          "lastName",
          "email",
          "isActive",
          "permissions",
        ],
        skip: offset,
        take: limit,
        relations: ["permissions"],
      });

      if (!users || users.length === 0) {
        throw new DoesNotExistError("Users do not exist");
      }

      const userResponses: UserResponseType[] = users.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive,
        permissions: user.permissions,
      }));

      return { count: userResponses.length, users: userResponses };
    } catch (error) {
      throw error;
    }
  }
}
