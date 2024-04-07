import bcrypt from "bcrypt";

import { AppDataSource } from "../../data-source";
import { User as UserTable } from "../../entities/User";
import { DoesNotExistError } from "../../errors";
import { UserUpdatedObserver } from "./observers/EmailNotifier";

export class UpdateUserService {
  private readonly observer: UserUpdatedObserver;

  constructor(observer: UserUpdatedObserver) {
    this.observer = observer;
  }

  async execute({
    id,
    firstName,
    lastName,
    email,
    admin,
    is_active,
    password,
  }: UserUpdate) {
    try {
      const userRepo = AppDataSource.getRepository(UserTable);
      const user = await userRepo.findOne({
        where: { id },
        select: [
          "firstName",
          "lastName",
          "email",
          "admin",
          "is_active",
          "password",
        ],
      });

      if (!user) {
        throw new DoesNotExistError("User does not exist");
      }

      userRepo.update(id as string, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        admin: admin,
        is_active: is_active,
        password: bcrypt.hashSync(password as string, 8),
      });

      const userResponse: UserUpdate = {
        id: id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        admin: admin,
        is_active: is_active,
      };

      if (
        password &&
        !(await bcrypt.compare(password.trim() as string, user.password))
      ) {
        this.observer.notify(user);
      }

      return { user: userResponse };
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
