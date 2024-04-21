import bcrypt from "bcrypt";

import { AppDataSource } from "../../data-source";
import { User as UserTable } from "../../entities/user/User";
import { AlreadyExistsError, ForbiddenError } from "../../errors";
import { UserCreatedObserver } from "./observers/EmailNotifier";
import { In } from "typeorm";
import { UserCreateType, UserResponseType } from "./_types";
import { UserPermission } from "../../entities/user/UserPermission";
import { getPermissions } from "./PermissionsUserService";

export class CreateUserService {
  private readonly observer: UserCreatedObserver;

  constructor(observer: UserCreatedObserver) {
    this.observer = observer;
  }
  async execute(
    authorization: any,
    {
      firstName,
      lastName,
      email,
      password,
      isActive,
      permissions,
    }: UserCreateType
  ) {
    try {
      const userRepo = AppDataSource.getRepository(UserTable);
      const userAlreadyExists = await userRepo.findOne({ where: { email } });

      const permissionsResult = await getPermissions(
        authorization,
        this.constructor.name
      );

      if (!permissionsResult.hasPermissions) {
        throw new ForbiddenError();
      }

      if (userAlreadyExists) {
        throw new AlreadyExistsError("User already exists");
      }

      const user = userRepo.create({
        firstName,
        lastName,
        email,
        password: bcrypt.hashSync(password as string, 10),
        isActive,
      });

      const userPermissionRepo = AppDataSource.getRepository(UserPermission);
      const userPermissions = await userPermissionRepo.find({
        where: { id: In(permissions) },
      });

      user.permissions = userPermissions;

      await userRepo.save(user);

      this.observer.notify(user);

      const userResponse: UserResponseType = {
        id: user.id,
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
