import { AppDataSource } from "../../data-source";

import { User as UserTable } from "../../entities/user/User";
import { DoesNotExistError, ForbiddenError } from "../../errors";
import { getPermissions } from "../PermissionsUserService";
import { UserType, UserIdType } from "./_types";

export class GetUserService {
  async execute(authorization: any, { id }: UserIdType) {
    try {
      const permissionsResult = await getPermissions(
        authorization,
        this.constructor.name
      );

      if (!permissionsResult.hasPermissions) {
        throw new ForbiddenError("You do not have permission");
      }

      const userRepo = AppDataSource.getRepository(UserTable);
      const user = await userRepo.findOne({
        where: { id },
        relations: ["permissions"],
      });

      if (!user) {
        throw new DoesNotExistError("User does not exist");
      }

      const userResponse: UserType = {
        id: id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive,
        permissions: user.permissions,
      };

      return { user: userResponse };
    } catch (error) {
      throw error;
    }
  }
}
