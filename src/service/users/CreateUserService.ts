import bcrypt from "bcrypt";

import { AppDataSource } from "../../data-source";
import { User as UserTable } from "../../entities/User";
import { AlreadyExistsError } from "../../errors";
import { UserCreatedObserver } from "./observers/EmailNotifier";

export class CreateUserService {
  private readonly observer: UserCreatedObserver;

  constructor(observer: UserCreatedObserver) {
    this.observer = observer;
  }
  async execute({
    name,
    email,
    admin = false,
    is_active = true,
    password,
  }: UserCreate) {
    try {
      const userRepo = AppDataSource.getRepository(UserTable);
      const userAlreadyExists = await userRepo.findOne({ where: { email } });

      if (userAlreadyExists) {
        throw new AlreadyExistsError("User already exists");
      }

      const user = userRepo.create({
        name,
        email,
        admin,
        is_active,
        password: bcrypt.hashSync(password as string, 10),
      });

      await userRepo.save(user);

      this.observer.notify(user);

      const userResponse: UserResponse = {
        id: user.id,
        name: name,
        admin: admin,
        is_active: is_active,
        email: email,
      };

      return { user: userResponse };
    } catch (error) {
      if (error instanceof AlreadyExistsError) {
        return {
          message: error.name,
          status_code: error.status(),
        };
      }
    }
  }
}
