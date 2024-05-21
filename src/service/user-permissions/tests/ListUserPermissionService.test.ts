import { DoesNotExistError, ForbiddenError } from "../../../errors";
import * as PermissionsUserService from "../../PermissionsUserService";
import { ListUserPermissionsService } from "../ListUserPermissionsService";
import { UserPermissionType } from "../_types";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET on /permissions using PermissionService", () => {
  const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....";

  const page = 1;

  const limit = 1;

  const permissionResponse: UserPermissionType = {
    id: "ec71bc...",
    type: "ADMIN",
  };

  const permissions = [permissionResponse, permissionResponse];

  it("throws error: You do not have permission", async () => {
    jest
      .spyOn(PermissionsUserService, "getPermissions")
      .mockResolvedValueOnce({ hasPermissions: false, permissions: [] });

    const listUserPermissionsService = new ListUserPermissionsService();

    await expect(
      listUserPermissionsService.execute(authorization, page, limit)
    ).rejects.toThrow(ForbiddenError);
  });

  it("throws error: Permissions do not exist", async () => {
    jest
      .spyOn(PermissionsUserService, "getPermissions")
      .mockResolvedValueOnce({ hasPermissions: true, permissions: [] });

    jest
      .spyOn(require("../../../data-source.ts").AppDataSource, "getRepository")
      .mockReturnValue({
        find: jest.fn().mockResolvedValue(false),
      });

    const listUserPermissionsService = new ListUserPermissionsService();

    await expect(
      listUserPermissionsService.execute(authorization, page, limit)
    ).rejects.toThrow(DoesNotExistError);
  });

  it("returns permissions created list", async () => {
    jest
      .spyOn(PermissionsUserService, "getPermissions")
      .mockResolvedValueOnce({ hasPermissions: true, permissions: [] });

    jest
      .spyOn(require("../../../data-source.ts").AppDataSource, "getRepository")
      .mockReturnValue({
        find: jest.fn().mockResolvedValue(permissions),
      });

    const listUserPermissionsService = new ListUserPermissionsService();

    const request = await listUserPermissionsService.execute(
      authorization,
      page,
      limit
    );

    expect(request).toEqual({ count: permissions.length, permissions });
  });
});
