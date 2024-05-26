import { SpecificationType, StatusType } from "../../../entities/essay/Enum";
import { UserPermission } from "../../../entities/user/UserPermission";
import { DoesNotExistError, ForbiddenError } from "../../../errors";
import * as PermissionsUserService from "../../PermissionsUserService";
import { EssayType } from "../../essays/_types";
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

    const getUserService = new GetUserService();

    await expect(getUserService.execute(authorization, userId)).rejects.toThrow(
      ForbiddenError
    );
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

    const getUserService = new GetUserService();

    await expect(getUserService.execute(authorization, userId)).rejects.toThrow(
      DoesNotExistError
    );
  });
  it("returns user response", async () => {
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
      });

    const getUserService = new GetUserService();

    const request = await getUserService.execute(authorization, userRequest);

    expect(request).toEqual({ user: userResponse });
  });
});
