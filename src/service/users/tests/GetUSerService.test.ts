import { UserPermission } from "../../../entities/user/UserPermission";
import { DoesNotExistError, ForbiddenError } from "../../../errors";
import * as PermissionsUserService from "../../PermissionsUserService";
import { GetUserService } from "../GetUserService";
import { UserIdType, UserResponseType } from "../_types";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET on /user using GetUserService", () => {
  it("throws error: You do not have permission", async () => {
    const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....";

    const userId = {
      id: "3456-dfgh-5678-dfghj",
    };

    jest
      .spyOn(PermissionsUserService, "getPermissions")
      .mockResolvedValueOnce({ hasPermissions: false, permissions: [] });

    const deleteUserService = new GetUserService();

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

    const deleteUserService = new GetUserService();

    await expect(
      deleteUserService.execute(authorization, userId)
    ).rejects.toThrow(DoesNotExistError);
  });
  it("returns user deleted successfully", async () => {
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

    const deleteUserService = new GetUserService();

    const request = await deleteUserService.execute(authorization, userRequest);

    expect(request).toEqual({ user: userResponse });
  });
});
