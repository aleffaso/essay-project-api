import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as userAuthMiddleware from "../../../middleware/userAuthMiddleware";
import * as PermissionsUserService from "../../../service/PermissionsUserService";
import UserPermissionController from "../../user/UserPermissionController";
import { UserPermissionType } from "../../../service/user-permissions/_types";
import { CreateUserPermissionService } from "../../../service/user-permissions/CreateUserPermissionService";
import { AlreadyExistsError, ForbiddenError } from "../../../errors";
import { ListUserPermissionsService } from "../../../service/user-permissions/ListUserPermissionsService";

jest.mock("../../../service/users/AuthenticateUserService.ts");

describe("UserController", () => {
  let mockResponse: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  describe("POST on /permission route for creating user", () => {
    const request = {
      headers: {
        authorization: "Bearer eyJhbGciOiJIUzI1Ni...",
      },
      body: {
        type: "ADMIN",
      },
    } as Request;

    it("should return 'You do not have permission' and return status code 403", async () => {
      jest.spyOn(jwt, "verify").mockReturnValue({
        id: "ec71bc...",
      } as any);

      jest
        .spyOn(userAuthMiddleware, "default")
        .mockImplementation((req, res, next) => {
          next();
          return Promise.resolve();
        });

      jest
        .spyOn(PermissionsUserService, "getPermissions")
        .mockResolvedValueOnce({ hasPermissions: false, permissions: [] });

      const createUserPermissionService = new CreateUserPermissionService();

      jest
        .spyOn(createUserPermissionService, "execute")
        .mockRejectedValue(new ForbiddenError("You do not have permission"));

      await UserPermissionController.create(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "You do not have permission",
      });
    });

    it("should return 'Permission already exists' and return status code 409", async () => {
      jest.spyOn(jwt, "verify").mockReturnValue({
        id: "ec71bc...",
      } as any);

      jest
        .spyOn(userAuthMiddleware, "default")
        .mockImplementation((req, res, next) => {
          next();
          return Promise.resolve();
        });

      jest
        .spyOn(PermissionsUserService, "getPermissions")
        .mockResolvedValueOnce({ hasPermissions: true, permissions: [] });

      jest
        .spyOn(
          require("../../../data-source.ts").AppDataSource,
          "getRepository"
        )
        .mockReturnValue({
          findOne: jest.fn().mockResolvedValue(true),
        });

      const createUserPermissionService = new CreateUserPermissionService();

      jest
        .spyOn(createUserPermissionService, "execute")
        .mockRejectedValue(new AlreadyExistsError("Permission already exists"));

      await UserPermissionController.create(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Permission already exists",
      });
    });

    it("returns permission created and return status code 200", async () => {
      const userPermissionResponse: UserPermissionType = {
        id: "ec71bc...",
        type: request.body.type,
      };

      jest.spyOn(jwt, "verify").mockReturnValue({
        id: "ec71bc...",
      } as any);

      jest
        .spyOn(userAuthMiddleware, "default")
        .mockImplementation((req, res, next) => {
          next();
          return Promise.resolve();
        });

      jest
        .spyOn(PermissionsUserService, "getPermissions")
        .mockResolvedValueOnce({ hasPermissions: true, permissions: [] });

      jest
        .spyOn(
          require("../../../data-source.ts").AppDataSource,
          "getRepository"
        )
        .mockReturnValue({
          findOne: jest.fn().mockResolvedValue(false),
          create: jest.fn().mockImplementation((permission) => ({
            ...permission,
            id: userPermissionResponse.id,
          })),
          save: jest.fn().mockImplementation((permission) => ({
            ...permission,
          })),
        });

      const createUserPermissionService = new CreateUserPermissionService();

      jest
        .spyOn(createUserPermissionService, "execute")
        .mockResolvedValue({ permission: userPermissionResponse });

      await UserPermissionController.create(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        permission: userPermissionResponse,
      });
    });
  });

  describe("GET on /permissions route for listing user", () => {
    const request = {
      headers: {
        authorization: "Bearer eyJhbGciOiJIUzI1Ni...",
      },
      query: {
        page: 1,
        limit: 10,
      },
      body: {
        type: "ADMIN",
      },
    } as unknown as Request;

    it("should return 'You do not have permission' and return status code 403", async () => {
      jest.spyOn(jwt, "verify").mockReturnValue({
        id: "ec71bc...",
      } as any);

      jest
        .spyOn(userAuthMiddleware, "default")
        .mockImplementation((req, res, next) => {
          next();
          return Promise.resolve();
        });

      jest
        .spyOn(PermissionsUserService, "getPermissions")
        .mockResolvedValueOnce({ hasPermissions: false, permissions: [] });

      const listUserPermissionsService = new ListUserPermissionsService();

      jest
        .spyOn(listUserPermissionsService, "execute")
        .mockRejectedValue(new ForbiddenError("You do not have permission"));

      await UserPermissionController.list(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "You do not have permission",
      });
    });

    it("should return 'Permissions do not exist' and return status code 401", async () => {
      jest.spyOn(jwt, "verify").mockReturnValue({
        id: "ec71bc...",
      } as any);

      jest
        .spyOn(userAuthMiddleware, "default")
        .mockImplementation((req, res, next) => {
          next();
          return Promise.resolve();
        });

      jest
        .spyOn(PermissionsUserService, "getPermissions")
        .mockResolvedValueOnce({ hasPermissions: true, permissions: [] });

      jest
        .spyOn(
          require("../../../data-source.ts").AppDataSource,
          "getRepository"
        )
        .mockReturnValue({
          find: jest.fn().mockResolvedValue(false),
        });

      const listUserPermissionsService = new ListUserPermissionsService();

      jest
        .spyOn(listUserPermissionsService, "execute")
        .mockRejectedValue(new ForbiddenError("Permissions do not exist"));

      await UserPermissionController.list(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Permissions do not exist",
      });
    });

    it("should return permissions and return status code 200", async () => {
      const userPermissionResponse: UserPermissionType = {
        id: "ec71bc...",
        type: request.body.type,
      };

      const userPermissionresponses = [
        userPermissionResponse,
        userPermissionResponse,
      ];

      jest.spyOn(jwt, "verify").mockReturnValue({
        id: "ec71bc...",
      } as any);

      jest
        .spyOn(userAuthMiddleware, "default")
        .mockImplementation((req, res, next) => {
          next();
          return Promise.resolve();
        });

      jest
        .spyOn(PermissionsUserService, "getPermissions")
        .mockResolvedValueOnce({ hasPermissions: true, permissions: [] });

      jest
        .spyOn(
          require("../../../data-source.ts").AppDataSource,
          "getRepository"
        )
        .mockReturnValue({
          find: jest.fn().mockResolvedValue(userPermissionresponses),
        });

      const listUserPermissionsService = new ListUserPermissionsService();

      jest.spyOn(listUserPermissionsService, "execute").mockResolvedValue({
        count: userPermissionresponses.length,
        permissions: userPermissionresponses,
      });

      await UserPermissionController.list(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        count: userPermissionresponses.length,
        permissions: userPermissionresponses,
      });
    });
  });
});
