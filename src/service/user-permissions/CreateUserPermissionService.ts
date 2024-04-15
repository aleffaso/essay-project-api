import { AppDataSource } from "../../data-source";
import { UserPermission as UserPermissionTable } from "../../entities/user/UserPermission";
import { AlreadyExistsError } from "../../errors";
import { UserPermissionCreateType, UserPermissionType } from "./_types";

export class CreateUserPermissionService {
  async execute({ type }: UserPermissionCreateType) {
    try {
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
