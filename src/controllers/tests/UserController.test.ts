import bcrypt from "bcrypt";
import { Request, Response } from "express";
import UserController from "../user/UserController";
import { AuthenticateUserService } from "../../service/users/AuthenticateUserService";
import {
  AlreadyExistsError,
  DoesNotExistError,
  ForbiddenError,
} from "../../errors";
import { CreateUserService } from "../../service/users/CreateUserService";
import {
  EmailCreationNotifier,
  EmailUpdateNotifier,
} from "../../service/users/observers/EmailNotifier";
import * as userAuthMiddleware from "../../middleware/userAuthMiddleware";
import * as PermissionsUserService from "../../service/PermissionsUserService";
import jwt from "jsonwebtoken";
import { UserPermission } from "../../entities/user/UserPermission";
import { UserResponseType, UserUpdateType } from "../../service/users/_types";
import { UpdateUserService } from "../../service/users/UpdateUserService";
import { GetUserService } from "../../service/users/GetUserService";

jest.mock("../../service/users/AuthenticateUserService");

describe("UserController", () => {
  let mockResponse: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  describe("POST on /user/authenticate route for authenticating user", () => {
    const request = {
      body: {
        email: "test@example.com",
        password: "testing1234",
      },
    } as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    it("should return 'Invalid credentials' and return status code 401", async () => {
      (
        AuthenticateUserService as jest.MockedClass<
          typeof AuthenticateUserService
        >
      ).mockImplementationOnce(() => ({
        execute: jest
          .fn()
          .mockRejectedValue(new DoesNotExistError("Invalid credentials")),
      }));

      await UserController.authenticate(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid credentials",
      });
    });

    it("should return 'Internal Server Error' and return status code 500", async () => {
      (
        AuthenticateUserService as jest.MockedClass<
          typeof AuthenticateUserService
        >
      ).mockImplementationOnce(() => ({
        execute: jest
          .fn()
          .mockRejectedValue(new Error("Internal Server Error")),
      }));

      await UserController.authenticate(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: new Error("Internal Server Error"),
        message: "Internal Server Error",
      });
    });

    it("should return user and token and return status code 200", async () => {
      (
        AuthenticateUserService as jest.MockedClass<
          typeof AuthenticateUserService
        >
      ).mockImplementationOnce(() => ({
        execute: jest.fn().mockResolvedValue({
          user: {
            id: "ec71bc...",
            firstName: "Test",
            lastName: "User",
            email: "valid@example.com",
            permissions: ["ADMIN", "DEVELOPER"],
          },
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....",
        }),
      }));

      await UserController.authenticate(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: {
          id: "ec71bc...",
          firstName: "Test",
          lastName: "User",
          email: "valid@example.com",
          permissions: ["ADMIN", "DEVELOPER"],
        },
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....",
      });
    });
  });

  describe("POST on /user route for creating user", () => {
    const request = {
      headers: {
        authorization: "Bearer eyJhbGciOiJIUzI1Ni...",
      },
      body: {
        firstName: "John",
        lastName: "Smith",
        email: "john@smith.com",
        password: "password",
        isActive: true,
        permissions: ["2"],
      },
    } as Request;

    it("should return 'You do not have permission' and return status code 403", async () => {
      const permissions = [{ id: "2", type: "ADMIN" }];

      const userResponse: UserResponseType = {
        id: "ec71bc...",
        firstName: "John",
        lastName: "Smith",
        email: "john@smith.com",
        isActive: true,
        permissions: permissions as unknown as UserPermission[],
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
        .mockResolvedValueOnce({ hasPermissions: false, permissions: [] });

      jest
        .spyOn(require("../../data-source.ts").AppDataSource, "getRepository")
        .mockReturnValue({
          findOne: jest.fn().mockResolvedValue(userResponse),
        });

      const observer = new EmailCreationNotifier();

      const createUserService = new CreateUserService(observer);

      jest
        .spyOn(createUserService, "execute")
        .mockRejectedValue(new ForbiddenError("You do not have permission"));

      await UserController.create(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "You do not have permission",
      });
    });

    it("should return 'User already exists' and return status code 409", async () => {
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
        .spyOn(require("../../data-source.ts").AppDataSource, "getRepository")
        .mockReturnValue({
          findOne: jest.fn().mockResolvedValue(true),
        });

      const observer = new EmailCreationNotifier();

      const createUserService = new CreateUserService(observer);

      jest
        .spyOn(createUserService, "execute")
        .mockRejectedValue(new AlreadyExistsError("User already exists"));

      await UserController.create(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "User already exists",
      });
    });

    it("Return created user and status code 200", async () => {
      const permissions = [{ id: "2", type: "ADMIN" }];

      const userResponse: UserResponseType = {
        id: "ec71bc...",
        firstName: "John",
        lastName: "Smith",
        email: "john@smith.com",
        isActive: true,
        permissions: permissions as unknown as UserPermission[],
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

      jest.spyOn(bcrypt, "hashSync").mockReturnValue("hashedPassword");

      jest
        .spyOn(require("../../data-source.ts").AppDataSource, "getRepository")
        .mockReturnValue({
          findOne: jest.fn().mockResolvedValue(false),
          create: jest.fn().mockImplementation((user) => ({
            ...user,
            id: userResponse.id,
            password: "hashedPassword",
          })),
          find: jest.fn().mockResolvedValue(permissions),
          save: jest.fn().mockImplementation((user) => ({
            ...user,
            permissions: permissions,
          })),
        });

      const observer = new EmailCreationNotifier();

      const createUserService = new CreateUserService(observer);

      jest
        .spyOn(createUserService, "execute")
        .mockRejectedValue(new AlreadyExistsError("User already exists"));

      await UserController.create(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ user: userResponse });
    });
  });

  describe("POST on /user route for updating user", () => {
    const request = {
      headers: {
        authorization: "Bearer eyJhbGciOiJIUzI1Ni...",
      },
      params: {
        id: "ec71bc...",
      },
      body: {
        firstName: "John",
        lastName: "Smith",
        email: "john@smith.com",
        password: "password",
        isActive: true,
        permissions: ["2"],
      },
    } as unknown as Request;

    it("should return 'You do not have permission' and return status code 403", async () => {
      const permissions = [{ id: "2", type: "ADMIN" }];

      const userResponse: UserResponseType = {
        id: "ec71bc...",
        firstName: "John",
        lastName: "Smith",
        email: "john@smith.com",
        isActive: true,
        permissions: permissions as unknown as UserPermission[],
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
        .mockResolvedValueOnce({ hasPermissions: false, permissions: [] });

      jest
        .spyOn(require("../../data-source.ts").AppDataSource, "getRepository")
        .mockReturnValue({
          findOne: jest.fn().mockResolvedValue(userResponse),
        });

      const observer = new EmailUpdateNotifier();

      const updateUserService = new UpdateUserService(observer);

      jest
        .spyOn(updateUserService, "execute")
        .mockRejectedValue(new ForbiddenError("You do not have permission"));

      await UserController.update(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "You do not have permission",
      });
    });

    it("should return 'User does not exist' and return status code 401", async () => {
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
        .spyOn(require("../../data-source.ts").AppDataSource, "getRepository")
        .mockReturnValue({
          findOne: jest.fn().mockReturnValue(false),
        });

      const observer = new EmailUpdateNotifier();

      const updateUserService = new UpdateUserService(observer);

      jest
        .spyOn(updateUserService, "execute")
        .mockRejectedValue(new DoesNotExistError("User does not exists"));

      await UserController.update(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "User does not exist",
      });
    });

    it("should return 'Email already in use' and return status code 409", async () => {
      const permissions = [{ id: "2", type: "ADMIN" }];

      const userRequest = {
        email: "john@smith.com",
      };

      const userResponse: UserResponseType = {
        id: "ec71bc...",
        firstName: "John",
        lastName: "Smith",
        email: "john@smith.com",
        isActive: true,
        permissions: permissions as unknown as UserPermission[],
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
        .spyOn(require("../../data-source.ts").AppDataSource, "getRepository")
        .mockReturnValue({
          findOne: jest.fn().mockImplementation(async (query) => {
            if (query.where && userResponse.email === userRequest.email) {
              return true;
            }
            return false;
          }),
        });

      const observer = new EmailUpdateNotifier();

      const updateUserService = new UpdateUserService(observer);

      jest
        .spyOn(updateUserService, "execute")
        .mockRejectedValue(new AlreadyExistsError("E-mail already in use"));

      await UserController.update(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Email already in use",
      });
    });
  });

  describe("GET on /user route for getting a single user", () => {
    const request = {
      headers: {
        authorization: "Bearer eyJhbGciOiJIUzI1Ni...",
      },
      params: {
        id: "ec71bc...",
      },
    } as unknown as Request;

    it("should return 'You do not have permission' and return status code 403", async () => {
      const permissions = [{ id: "2", type: "ADMIN" }];

      const userResponse: UserResponseType = {
        id: "ec71bc...",
        firstName: "John",
        lastName: "Smith",
        email: "john@smith.com",
        isActive: true,
        permissions: permissions as unknown as UserPermission[],
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
        .mockResolvedValueOnce({ hasPermissions: false, permissions: [] });

      jest
        .spyOn(require("../../data-source.ts").AppDataSource, "getRepository")
        .mockReturnValue({
          findOne: jest.fn().mockResolvedValue(userResponse),
        });

      const getUserService = new GetUserService();

      jest
        .spyOn(getUserService, "execute")
        .mockRejectedValue(new ForbiddenError("You do not have permission"));

      await UserController.get(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "You do not have permission",
      });
    });

    it("should return 'User does not exist' and return status code 401", async () => {
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
        .spyOn(require("../../data-source.ts").AppDataSource, "getRepository")
        .mockReturnValue({
          findOne: jest.fn().mockReturnValue(false),
        });

      const getUserService = new GetUserService();

      jest
        .spyOn(getUserService, "execute")
        .mockRejectedValue(new DoesNotExistError("User does not exist"));

      await UserController.get(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "User does not exist",
      });
    });
  });
});
