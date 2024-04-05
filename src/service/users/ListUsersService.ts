import { AppDataSource } from "../../data-source";

import { User as UserTable } from "../../entities/User";
import { DoesNotExistError } from "../../errors";

export class ListUsersService {
  async execute(page: number, limit: number) {
    try {
      const userRepo = AppDataSource.getRepository(UserTable);
      const offset = (page - 1) * limit;
      const users = await userRepo.find({
        skip: offset,
        take: limit,
      });

      if (!users || users.length === 0) {
        throw new DoesNotExistError("Users do not exist");
      }

      return { count: users.length, users };
    } catch (error) {
      if (error instanceof DoesNotExistError) {
        return {
          message: error.name,
          status_code: error.status(),
        };
      }
    }
  }
}
