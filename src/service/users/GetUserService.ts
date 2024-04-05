import { AppDataSource } from "../../data-source";

import { User as UserTable } from "../../entities/User";
import { DoesNotExistError } from "../../errors";

export class GetUserService {
  async execute({ id }: UserId) {
    try {
      const userRepo = AppDataSource.getRepository(UserTable);

      const user = await userRepo.findOne({ where: { id } });

      if (!user) {
        throw new DoesNotExistError("Essay does not exist");
      }

      const essayResponse: User = {
        id: id,
        name: user.name,
        admin: user.admin,
        is_active: user.is_active,
        email: user.email,
      };

      return { essay: essayResponse };
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
