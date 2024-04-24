import bcrypt, { hashSync } from "bcrypt";
import { AlreadyExistsError, ForbiddenError } from "../../../errors";
import { CreateUserService } from "../CreateUserService";
import * as PermissionsUserService from "../../PermissionsUserService";
import { UserCreateType, UserResponseType } from "../_types";
import { EmailCreationNotifier } from "../observers/EmailNotifier";
import { UserPermission } from "../../../entities/user/UserPermission";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST on /user using UserService", () => {
  it("throws error: You do not have permission", async () => {
    const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....";

    const userRequest: UserCreateType = {
      firstName: "John",
      lastName: "Smith",
      email: "john@smith.com",
      password: "password",
      isActive: true,
      permissions: [],
    };

    jest
      .spyOn(PermissionsUserService, "getPermissions")
      .mockResolvedValueOnce({ hasPermissions: false, permissions: [] });

    const observer = new EmailCreationNotifier();

    const createUserService = new CreateUserService(observer);

    await expect(
      createUserService.execute(authorization, userRequest)
    ).rejects.toThrow(ForbiddenError);
  });

  it("throws error: User already exists", async () => {
    const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....";

    const permissions = [
      { id: 1, type: "ADMIN" },
      { id: 2, type: "CUSTOMER" },
    ];
    const userRequest = {
      firstName: "John",
      lastName: "Smith",
      email: "john@smith.com",
      password: "password",
      isActive: true,
      permissions: permissions as unknown as UserPermission[],
    };

    const userResponse: UserResponseType = {
      id: "ec71bc...",
      firstName: userRequest.firstName,
      lastName: userRequest.lastName,
      email: userRequest.email,
      isActive: userRequest.isActive,
      permissions: userRequest.permissions,
    };

    jest
      .spyOn(PermissionsUserService, "getPermissions")
      .mockResolvedValueOnce({ hasPermissions: true, permissions: [] });

    jest
      .spyOn(require("../../../data-source.ts").AppDataSource, "getRepository")
      .mockReturnValue({
        findOne: jest.fn().mockResolvedValue(userResponse),
      });

    const observer = new EmailCreationNotifier();

    const createUserService = new CreateUserService(observer);

    await expect(
      createUserService.execute(authorization, userRequest)
    ).rejects.toThrow(AlreadyExistsError);
  });

  it("throws user created successfully", async () => {
    const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....";

    const userRequest: UserCreateType = {
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

    const userResponse: UserResponseType = {
      id: "ec71bc...",
      firstName: userRequest.firstName,
      lastName: userRequest.lastName,
      email: userRequest.email,
      isActive: userRequest.isActive,
      permissions: permissionResponse as unknown as UserPermission[],
    };

    jest
      .spyOn(PermissionsUserService, "getPermissions")
      .mockResolvedValueOnce({ hasPermissions: true, permissions: [] });

    const mockFindOne = jest.fn().mockResolvedValue(false);

    jest.spyOn(bcrypt, "hashSync").mockReturnValue("hashedPassword");

    const mockCreate = jest.fn().mockImplementation((user) => ({
      ...user,
      id: userResponse.id,
      password: "hashedPassword",
    }));
    const mockFind = jest.fn().mockResolvedValue(permissionResponse);
    const mockSave = jest.fn().mockImplementation((user) => ({
      ...user,
      permissions: permissionResponse,
    }));

    jest
      .spyOn(require("../../../data-source.ts").AppDataSource, "getRepository")
      .mockReturnValue({
        findOne: mockFindOne,
        create: mockCreate,
        find: mockFind,
        save: mockSave,
      });

    const observer = new EmailCreationNotifier();

    const createUserService = new CreateUserService(observer);

    const request = await createUserService.execute(authorization, userRequest);

    expect(request).toEqual({ user: userResponse });
  });
});
