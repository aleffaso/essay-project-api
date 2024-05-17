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
import { UserResponseType } from "../../service/users/_types";
import { UpdateUserService } from "../../service/users/UpdateUserService";
import { GetUserService } from "../../service/users/GetUserService";
import { ListUsersService } from "../../service/users/ListUsersService";
import { DeleteUserService } from "../../service/users/DeleteUserService";

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

  describe("PUT on /user route for updating user", () => {
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

    it("should return userRequest and return status code 200", async () => {
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

      const userRequest = {
        password: "password",
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
            if (query.where && query.where.email) {
              return false;
            }
            return { ...userResponse, password: userRequest.password };
          }),
          find: jest.fn().mockResolvedValue(permissionResponse),
          save: jest.fn().mockResolvedValue({ userRequest: userResponse }),
        });

      const observer = new EmailUpdateNotifier();

      const updateUserService = new UpdateUserService(observer);

      jest
        .spyOn(updateUserService, "execute")
        .mockResolvedValue({ user: userResponse });

      await UserController.update(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ user: userResponse });
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

    const permissions = [{ id: "2", type: "ADMIN" }];

    const userResponse: UserResponseType = {
      id: "ec71bc...",
      firstName: "John",
      lastName: "Smith",
      email: "john@smith.com",
      isActive: true,
      permissions: permissions as unknown as UserPermission[],
    };

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

    it("should return userRequest and return status code 200", async () => {
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
          findOne: jest.fn().mockResolvedValue(userResponse),
        });

      const getUserService = new GetUserService();

      jest
        .spyOn(getUserService, "execute")
        .mockResolvedValue({ user: userResponse });

      await UserController.get(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ user: userResponse });
    });
  });

  describe("GET on /users route for listing many users", () => {
    const request = {
      headers: {
        authorization: "Bearer eyJhbGciOiJIUzI1Ni...",
      },
      query: {
        page: 1,
        limit: 1,
      },
    } as unknown as Request;

    const permissions = [
      { id: "2", type: "ADMIN" },
    ] as unknown as UserPermission[];

    const userResponse: UserResponseType = {
      id: "ec71bc...",
      firstName: "John",
      lastName: "Smith",
      email: "john@smith.com",
      isActive: true,
      permissions: permissions as unknown as UserPermission[],
    };

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

      jest
        .spyOn(require("../../data-source.ts").AppDataSource, "getRepository")
        .mockReturnValue({
          find: jest.fn().mockResolvedValue(false),
        });

      const listUserService = new ListUsersService();

      jest
        .spyOn(listUserService, "execute")
        .mockRejectedValue(new ForbiddenError("You do not have permission"));

      await UserController.list(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "You do not have permission",
      });
    });

    it("should return 'Users does not exist' and return status code 401", async () => {
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
          find: jest.fn().mockReturnValue(false),
        });

      const listUserService = new ListUsersService();

      jest
        .spyOn(listUserService, "execute")
        .mockRejectedValue(new DoesNotExistError("User does not exist"));

      await UserController.list(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Users do not exist",
      });
    });

    it("should return users list and return status code 200", async () => {
      const usersResponses = [userResponse, userResponse];

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
          find: jest.fn().mockReturnValue(usersResponses),
        });

      const listUserService = new ListUsersService();

      jest.spyOn(listUserService, "execute").mockResolvedValue({
        count: usersResponses.length,
        users: usersResponses,
      });

      await UserController.list(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        count: usersResponses.length,
        users: usersResponses,
      });
    });
  });

  describe("DELETE on /user route for delete a single user", () => {
    const request = {
      headers: {
        authorization: "Bearer eyJhbGciOiJIUzI1Ni...",
      },
      params: {
        id: "ec71bc...",
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

      jest
        .spyOn(require("../../data-source.ts").AppDataSource, "getRepository")
        .mockReturnValue({
          findOne: jest.fn().mockResolvedValue(false),
        });

      const deleteUserService = new DeleteUserService();

      jest
        .spyOn(deleteUserService, "execute")
        .mockRejectedValue(new ForbiddenError("You do not have permission"));

      await UserController.delete(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "You do not have permission",
      });
    });

    it("should return 'Users does not exist' and return status code 401", async () => {
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

      const deleteUserService = new DeleteUserService();

      jest
        .spyOn(deleteUserService, "execute")
        .mockRejectedValue(new DoesNotExistError("User does not exist"));

      await UserController.delete(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "User does not exist",
      });
    });

    it("should delete a user and return status code 200", async () => {
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
          findOne: jest.fn().mockReturnValue(true),
          delete: jest.fn().mockReturnValue(request.params.id),
        });

      const deleteUserService = new DeleteUserService();

      jest.spyOn(deleteUserService, "execute").mockReturnThis();

      await UserController.delete(request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Deleted successfully",
      });
    });
  });
});
