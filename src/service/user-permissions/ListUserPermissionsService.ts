import { AppDataSource } from "../../data-source";

import { UserPermission as UserPermissionTable } from "../../entities/user/UserPermission";
import { DoesNotExistError } from "../../errors";

export class ListUserPermissionsService {
  async execute(authorization: any, page: number, limit: number) {
    try {
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
