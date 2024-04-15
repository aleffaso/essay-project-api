import { AppDataSource } from "../../data-source";

import { User as UserTable } from "../../entities/user/User";
import { DoesNotExistError } from "../../errors";
import { UserIdType } from "./_types";

export class DeleteUserService {
  async execute({ id }: UserIdType) {
    try {
      const userRepo = AppDataSource.getRepository(UserTable);
      const user = await userRepo.findOne({ where: { id } });

      if (!user) {
        throw new DoesNotExistError("User does not exist");
      }

      return await userRepo.delete({ id });
    } catch (error) {
      throw error;
    }
  }
}
