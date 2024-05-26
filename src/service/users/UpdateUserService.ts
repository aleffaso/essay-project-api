import bcrypt from "bcrypt";

import { AppDataSource } from "../../data-source";
import { User as UserTable } from "../../entities/user/User";
import {
  AlreadyExistsError,
  DoesNotExistError,
  ForbiddenError,
} from "../../errors";
import { UserUpdatedObserver } from "./observers/EmailNotifier";
import { UserUpdateType, UserIdType } from "./_types";
import { In } from "typeorm";
import { UserPermission } from "../../entities/user/UserPermission";
import { getPermissions } from "../PermissionsUserService";

export class UpdateUserService {
  private readonly observer: UserUpdatedObserver;

  constructor(observer: UserUpdatedObserver) {
    this.observer = observer;
  }

  async execute(
    authorization: any,
    {
      id,
      firstName,
      lastName,
      email,
      isActive,
      password,
      permissions,
    }: UserUpdateType & UserIdType
  ) {
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

      if (email && email !== user.email) {
        const existingUser = await userRepo.findOne({ where: { email } });
        if (existingUser) {
          throw new AlreadyExistsError("Email already in use");
        }
      }

      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      if (isActive !== undefined) user.isActive = isActive;

      if (password && !(await bcrypt.compare(password, user.password))) {
        this.observer.notify(user);
      }

      if (password) {
        user.password = bcrypt.hashSync(password, 8);
      }

      if (permissions) {
        const userPermissionRepo = AppDataSource.getRepository(UserPermission);
        const userPermissions = await userPermissionRepo.find({
          where: { id: In(permissions) },
        });
        user.permissions = userPermissions;
      }

      await userRepo.save(user);

      const userResponse: UserUpdateType & UserIdType = {
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
