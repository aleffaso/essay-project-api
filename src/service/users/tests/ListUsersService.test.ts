import { UserPermission } from "../../../entities/user/UserPermission";
import { DoesNotExistError, ForbiddenError } from "../../../errors";
import * as PermissionsUserService from "../../PermissionsUserService";
import { ListUsersService } from "../ListUsersService";
import { UserResponseType } from "../_types";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET on /users using ListUserService", () => {
  it("throws error: You do not have permission", async () => {
    const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....";

    const page = 1;

    const limit = 1;

    jest
      .spyOn(PermissionsUserService, "getPermissions")
      .mockResolvedValueOnce({ hasPermissions: false, permissions: [] });

    const listUsersService = new ListUsersService();

    await expect(
      listUsersService.execute(authorization, page, limit)
    ).rejects.toThrow(ForbiddenError);
  });

  it("throws error: You do not have permission", async () => {
    const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....";

    const page = 1;

    const limit = 10;

    jest
      .spyOn(PermissionsUserService, "getPermissions")
      .mockResolvedValueOnce({ hasPermissions: true, permissions: [] });

    jest
      .spyOn(require("../../../data-source.ts").AppDataSource, "getRepository")
      .mockReturnValue({
        find: jest.fn().mockResolvedValue(false),
      });

    const listUsersService = new ListUsersService();

    await expect(
      listUsersService.execute(authorization, page, limit)
    ).rejects.toThrow(DoesNotExistError);
  });

  it("returns users list", async () => {
    const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....";

    const page = 1;

    const limit = 1;

    const permissionResponse = [
      { id: "1", type: "ADMIN" },
      { id: "2", type: "CUSTOMER" },
    ] as unknown as UserPermission[];

    const userResponse: UserResponseType = {
      id: "ec71bc...",
      firstName: "John",
      lastName: "Smith",
      email: "john@smith.com",
      isActive: true,
      permissions: permissionResponse as unknown as UserPermission[],
    };

    const usersResponse = [userResponse, userResponse];
    jest
      .spyOn(PermissionsUserService, "getPermissions")
      .mockResolvedValueOnce({ hasPermissions: true, permissions: [] });

    jest
      .spyOn(require("../../../data-source.ts").AppDataSource, "getRepository")
      .mockReturnValue({
        find: jest.fn().mockResolvedValue(usersResponse),
      });

    const listUsersService = new ListUsersService();

    const request = await listUsersService.execute(authorization, page, limit);

    expect(request).toEqual({
      count: usersResponse.length,
      users: usersResponse,
    });
  });
});
