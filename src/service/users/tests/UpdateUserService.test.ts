import bcrypt from "bcrypt";

import { UserPermission } from "../../../entities/user/UserPermission";
import {
  AlreadyExistsError,
  DoesNotExistError,
  ForbiddenError,
} from "../../../errors";
import * as PermissionsUserService from "../../PermissionsUserService";
import { UpdateUserService } from "../UpdateUserService";
import { UserUpdateType } from "../_types";
import {
  EmailCreationNotifier,
  EmailUpdateNotifier,
} from "../observers/EmailNotifier";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("PUT on /user using UpdateUserService", () => {
  it("throws error: You do not have permission", async () => {
    const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....";

    const userRequest: UserUpdateType = {
      id: "ec71bc...",
      firstName: "John",
      lastName: "Smith",
      email: "john@smith.com",
      password: "password",
      isActive: true,
      permissions: [] as unknown as UserPermission[],
    };

    jest
      .spyOn(PermissionsUserService, "getPermissions")
      .mockResolvedValueOnce({ hasPermissions: false, permissions: [] });

    const observer = new EmailCreationNotifier();

    const createUserService = new UpdateUserService(observer);

    await expect(
      createUserService.execute(authorization, userRequest)
    ).rejects.toThrow(ForbiddenError);
  });

  it("throws error: User does not exist", async () => {
    const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....";

    const userRequest = {
      id: "ec71bc...",
      firstName: "John",
      lastName: "Smith",
      email: "john@smith.com",
      password: "password",
      isActive: true,
      permissions: ["1", "2"] as unknown as UserPermission[],
    };

    jest
      .spyOn(PermissionsUserService, "getPermissions")
      .mockResolvedValueOnce({ hasPermissions: true, permissions: [] });

    jest
      .spyOn(require("../../../data-source.ts").AppDataSource, "getRepository")
      .mockReturnValue({
        findOne: jest.fn().mockReturnValue(false),
      });

    const observer = new EmailCreationNotifier();

    const updateUserService = new UpdateUserService(observer);

    await expect(
      updateUserService.execute(authorization, userRequest)
    ).rejects.toThrow(DoesNotExistError);
  });

  it("throws error: Email already in use", async () => {
    const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....";

    const userRequest = {
      id: "ec71bc...",
      firstName: "John",
      lastName: "Smith",
      email: "john2@smith.com",
      password: "password",
      isActive: true,
      permissions: ["1", "2"] as unknown as UserPermission[],
    };

    const permissionResponse = [
      { id: "1", type: "ADMIN" },
      { id: "2", type: "CUSTOMER" },
    ] as unknown as UserPermission[];

    const userResponse = {
      id: "ec71bc...",
      firstName: userRequest.firstName,
      lastName: userRequest.lastName,
      email: userRequest.email,
      isActive: userRequest.isActive,
      permissions: permissionResponse as unknown as UserPermission[],
    };

    const emailAlreadyExists = "john2@smith.com";

    jest
      .spyOn(PermissionsUserService, "getPermissions")
      .mockResolvedValueOnce({ hasPermissions: true, permissions: [] });

    jest
      .spyOn(require("../../../data-source.ts").AppDataSource, "getRepository")
      .mockReturnValue({
        findOne: jest.fn().mockImplementation(async (query) => {
          if (query.where && userResponse.email === emailAlreadyExists) {
            return true;
          }
          return false;
        }),
      });

    const observer = new EmailCreationNotifier();

    const updateUserService = new UpdateUserService(observer);

    const request = updateUserService.execute(authorization, userRequest);

    await expect(request).rejects.toThrow(AlreadyExistsError);
  });

  it("throws user password updated successfully", async () => {
    const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....";

    const userId = { id: "ec71bc..." };

    const userRequest = {
      firstName: "John",
      lastName: "Smith",
      email: "john@smith.com",
      password: "password",
      isActive: true,
      permissions: ["1", "2"] as unknown as UserPermission[],
    };

    const permissionResponse = [
      { id: "1", type: "ADMIN" },
      { id: "2", type: "CUSTOMER" },
    ] as unknown as UserPermission[];

    const userResponse = {
      id: userId.id,
      firstName: userRequest.firstName,
      lastName: userRequest.lastName,
      email: userRequest.email,
      isActive: userRequest.isActive,
      permissions: permissionResponse as unknown as UserPermission[],
    };

    jest
      .spyOn(PermissionsUserService, "getPermissions")
      .mockResolvedValueOnce({ hasPermissions: true, permissions: [] });

    jest
      .spyOn(require("../../../data-source.ts").AppDataSource, "getRepository")
      .mockReturnValue({
        findOne: jest.fn().mockImplementation(async (query) => {
          if (query.where && query.where.email) {
            return false;
          }
          return { ...userResponse, password: userRequest.password };
        }),
        find: jest.fn().mockResolvedValue(permissionResponse),
        save: jest.fn().mockResolvedValue(userRequest),
      });

    jest.spyOn(bcrypt, "compare").mockReturnValue(false as any);
    jest.spyOn(bcrypt, "hashSync").mockReturnValue("hashedPassword");

    const observer = new EmailUpdateNotifier();

    const updateUserService = new UpdateUserService(observer);

    const request = await updateUserService.execute(authorization, userRequest);

    expect(request).toEqual({ user: userResponse });
  });

  it("returns user has been updated successfully", async () => {
    const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....";

    const userId = { id: "ec71bc..." };

    const userRequest = {
      firstName: "John",
      lastName: "Smith",
      email: "john@smith.com",
      password: "password",
      isActive: true,
      permissions: ["1", "2"] as unknown as UserPermission[],
    };

    const permissionResponse = [
      { id: "1", type: "ADMIN" },
      { id: "2", type: "CUSTOMER" },
    ] as unknown as UserPermission[];

    const userResponse = {
      id: userId.id,
      firstName: userRequest.firstName,
      lastName: userRequest.lastName,
      email: userRequest.email,
      isActive: userRequest.isActive,
      permissions: permissionResponse as unknown as UserPermission[],
    };

    jest
      .spyOn(PermissionsUserService, "getPermissions")
      .mockResolvedValueOnce({ hasPermissions: true, permissions: [] });

    jest
      .spyOn(require("../../../data-source.ts").AppDataSource, "getRepository")
      .mockReturnValue({
        findOne: jest.fn().mockImplementation(async (query) => {
          if (query.where && query.where.email) {
            return false;
          }
          return { ...userResponse, password: userRequest.password };
        }),
        find: jest.fn().mockResolvedValue(permissionResponse),
        save: jest.fn().mockResolvedValue(userRequest),
      });

    jest.spyOn(bcrypt, "compare").mockReturnValue(true as any);

    const observer = new EmailUpdateNotifier();

    const updateUserService = new UpdateUserService(observer);

    const request = await updateUserService.execute(authorization, userRequest);

    expect(request).toEqual({ user: userResponse });
  });
});
