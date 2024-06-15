import * as PermissionsUserService from "../../../PermissionsUserService";
import { CreateUserPermissionService } from "../CreateUserPermissionService";
import { AlreadyExistsError, ForbiddenError } from "../../../../errors";
import { UserPermissionType } from "../_types";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST on /permission using PermissionService", () => {
  const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....";

  const permissionRequest = {
    type: "ADMIN",
  };

  const permissionResponse: UserPermissionType = {
    id: "ec71bc...",
    type: "ADMIN",
  };

  it("throws error: You do not have permission", async () => {
    jest
      .spyOn(PermissionsUserService, "getPermissions")
      .mockResolvedValueOnce({ hasPermissions: false, permissions: [] });

    const createUserPermissionService = new CreateUserPermissionService();

    await expect(
      createUserPermissionService.execute(authorization, permissionRequest)
    ).rejects.toThrow(ForbiddenError);
  });

  it("throws error: Permission already exists", async () => {
    jest
      .spyOn(PermissionsUserService, "getPermissions")
      .mockResolvedValueOnce({ hasPermissions: true, permissions: [] });

    jest
      .spyOn(
        require("../../../../data-source.ts").AppDataSource,
        "getRepository"
      )
      .mockReturnValue({
        findOne: jest.fn().mockResolvedValue(permissionRequest),
      });

    const createUserPermissionService = new CreateUserPermissionService();

    await expect(
      createUserPermissionService.execute(authorization, permissionRequest)
    ).rejects.toThrow(AlreadyExistsError);
  });

  it("returns permission created sucessfully", async () => {
    jest
      .spyOn(PermissionsUserService, "getPermissions")
      .mockResolvedValueOnce({ hasPermissions: true, permissions: [] });

    jest
      .spyOn(
        require("../../../../data-source.ts").AppDataSource,
        "getRepository"
      )
      .mockReturnValue({
        findOne: jest.fn().mockResolvedValue(false),
        create: jest.fn().mockImplementation((permission) => ({
          ...permission,
          id: permissionResponse.id,
          type: permissionResponse.type,
        })),
        save: jest.fn().mockImplementation((permission) => ({
          ...permission,
        })),
      });

    const createUserPermissionService = new CreateUserPermissionService();

    const request = await createUserPermissionService.execute(
      authorization,
      permissionRequest
    );

    expect(request).toEqual({ permission: permissionResponse });
  });
});
