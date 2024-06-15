import { AppDataSource } from "../../../data-source";

import { UserPermission as UserPermissionTable } from "../../../entities/user/UserPermission";
import { DoesNotExistError, ForbiddenError } from "../../../errors";
import { getPermissions } from "../../PermissionsUserService";

export class ListUserPermissionsService {
  async execute(authorization: any, page: number, limit: number) {
    try {
      const permissionsResult = await getPermissions(
        authorization,
        this.constructor.name
      );

      if (!permissionsResult.hasPermissions) {
        throw new ForbiddenError("You do not have permission");
      }

      const userPermissionRepo =
        AppDataSource.getRepository(UserPermissionTable);

      const offset = (page - 1) * limit;
      const permissions = await userPermissionRepo.find({
        skip: offset,
        take: limit,
      });

      if (!permissions || permissions.length === 0) {
        throw new DoesNotExistError("Permissions do not exist");
      }

      return { count: permissions.length, permissions };
    } catch (error) {
      throw error;
    }
  }
}
