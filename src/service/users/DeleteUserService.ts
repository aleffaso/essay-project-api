import { AppDataSource } from "../../data-source";

import { User as UserTable } from "../../entities/User";
import { DoesNotExistError } from "../../errors";

export class DeleteUserService {
  async execute({ id }: UserId) {
    try {
      const userRepo = AppDataSource.getRepository(UserTable);
      const user = await userRepo.findOne({ where: { id } });

      if (!user) {
        throw new DoesNotExistError("User does not exist");
      }

      return await userRepo.delete({ id });
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
