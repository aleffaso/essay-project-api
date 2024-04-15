import { AppDataSource } from "../../data-source";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { KEYS } from "../../constants";

import { User as UserTable } from "../../entities/user/User";
import { DoesNotExistError, ForbiddenError } from "../../errors";
import { verifyRequiredPermissions } from "../../utils";

const requiredPermissions = ["SUPPORT"];
export class ListUsersService {
  async execute(authorization: any, page: number, limit: number) {
    try {
      const userRepo = AppDataSource.getRepository(UserTable);
      const { id } = jwt.verify(authorization, KEYS.JWT.USER) as TokenPayload;

      const findUserPermission = await userRepo.findOne({
        where: { id },
        relations: ["permissions"],
      });

      if (
        findUserPermission &&
        verifyRequiredPermissions(findUserPermission, requiredPermissions)
      ) {
        const offset = (page - 1) * limit;
        const users = await userRepo.find({
          skip: offset,
          take: limit,
          relations: ["permissions"],
        });

        if (!users || users.length === 0) {
          throw new DoesNotExistError("Users do not exist");
        }

        return { count: users.length, users };
      }

      throw new ForbiddenError();
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new DoesNotExistError("Invalid token");
      }
      throw error;
    }
  }
}
