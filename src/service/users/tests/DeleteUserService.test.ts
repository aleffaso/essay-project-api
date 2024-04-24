import { UserPermission } from "../../../entities/user/UserPermission";
import {
  UserCreateType,
  UserIdType,
  UserResponseType,
  UserType,
} from "../_types";
import * as PermissionsUserService from "../../PermissionsUserService";
import { DeleteUserService } from "../DeleteUserService";
import { DoesNotExistError, ForbiddenError } from "../../../errors";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("DELETE on /user using DeleteUserService", () => {
  it("throws error: You do not have permission", async () => {
    const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....";

    const userId = {
      id: "3456-dfgh-5678-dfghj",
    };

    jest
      .spyOn(PermissionsUserService, "getPermissions")
      .mockResolvedValueOnce({ hasPermissions: false, permissions: [] });

    const deleteUserService = new DeleteUserService();

    await expect(
      deleteUserService.execute(authorization, userId)
    ).rejects.toThrow(ForbiddenError);
  });

  it("throws error: User does not exist", async () => {
    const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....";

    const userId = {
      id: "",
    };

    jest
      .spyOn(PermissionsUserService, "getPermissions")
      .mockResolvedValueOnce({ hasPermissions: true, permissions: [] });

    jest
      .spyOn(require("../../../data-source.ts").AppDataSource, "getRepository")
      .mockReturnValue({
        findOne: jest.fn().mockResolvedValue(false),
      });

    const deleteUserService = new DeleteUserService();

    await expect(
      deleteUserService.execute(authorization, userId)
    ).rejects.toThrow(DoesNotExistError);
  });

  it("throws user deleted successfully", async () => {
    const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....";

    const userRequest: UserIdType = {
      id: "ec71bc...",
    };

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

    jest
      .spyOn(PermissionsUserService, "getPermissions")
      .mockResolvedValueOnce({ hasPermissions: true, permissions: [] });

    jest
      .spyOn(require("../../../data-source.ts").AppDataSource, "getRepository")
      .mockReturnValue({
        findOne: jest.fn().mockResolvedValue(userResponse),
        delete: jest.fn().mockResolvedValue({ userRequest }),
      });

    const deleteUserService = new DeleteUserService();

    expect(await deleteUserService.execute(authorization, userRequest));
  });
});
