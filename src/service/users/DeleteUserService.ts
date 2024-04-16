import { AppDataSource } from "../../data-source";

import { User as UserTable } from "../../entities/user/User";
import { DoesNotExistError, ForbiddenError } from "../../errors";
import { getPermissions } from "./PermissionsUserService";
import { UserIdType } from "./_types";

export class DeleteUserService {
  async execute(authorization: any, { id }: UserIdType) {
    try {
      const userRepo = AppDataSource.getRepository(UserTable);
      const user = await userRepo.findOne({ where: { id } });

      const permissionsResult = await getPermissions(
        authorization,
        this.constructor.name
      );

      if (!permissionsResult.hasPermissions) {
        throw new ForbiddenError();
      }

      if (!user) {
        throw new DoesNotExistError("User does not exist");
      }

      return await userRepo.delete({ id });
    } catch (error) {
      throw error;
    }
  }
}
