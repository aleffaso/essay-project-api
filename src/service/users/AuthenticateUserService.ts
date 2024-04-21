import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { AppDataSource } from "../../data-source";
import { User as UserTable } from "../../entities/user/User";
import { KEYS } from "../../constants";
import { DoesNotExistError } from "../../errors";
import { UserRequestType } from "./_types";

class AuthenticateUserService {
  async execute({ email, password }: UserRequestType) {
    try {
      const userRepo = AppDataSource.getRepository(UserTable);
      const user = await userRepo.findOne({
        where: { email },
        relations: ["permissions"],
      });

      if (!user) {
        throw new DoesNotExistError("Invalid email or password");
      }

      if (!(await bcrypt.compare(password as string, user.password))) {
        throw new DoesNotExistError("Invalid email or password");
      }

      const token = jwt.sign({ id: user.id }, KEYS.JWT.USER, {
        expiresIn: KEYS.JWT.TOKEN_EXPIRES_IN,
      });

      return {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: email,
          permissions: user.permissions.map((permission) => permission.type),
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }
}

export { AuthenticateUserService };
