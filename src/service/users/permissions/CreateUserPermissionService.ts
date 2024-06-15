import { AppDataSource } from "../../../data-source";
import { UserPermission as UserPermissionTable } from "../../../entities/user/UserPermission";
import { AlreadyExistsError, ForbiddenError } from "../../../errors";
import { getPermissions } from "../../PermissionsUserService";
import { UserPermissionCreateType, UserPermissionType } from "./_types";

export class CreateUserPermissionService {
  async execute(authorization: any, { type }: UserPermissionCreateType) {
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
      const userPermissionAlreadyExists = await userPermissionRepo.findOne({
        where: { type },
      });

      if (userPermissionAlreadyExists) {
        throw new AlreadyExistsError("Permission already exists");
      }

      const userPermission = userPermissionRepo.create({
        type,
      });

      await userPermissionRepo.save(userPermission);

      const userPermissionResponse: UserPermissionType = {
        id: userPermission.id,
        type: userPermission.type,
      };

      return { permission: userPermissionResponse };
    } catch (error) {
      throw error;
    }
  }
}
