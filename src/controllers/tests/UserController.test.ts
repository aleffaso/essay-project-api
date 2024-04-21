import { Request, Response } from "express";
import UserController from "../user/UserController";
import { AuthenticateUserService } from "../../service/users/AuthenticateUserService";

jest.mock("../../service/users/AuthenticateUserService");

describe("UserController", () => {
  describe("POST on /user/authenticate", () => {
    const request = {
      body: {
        email: "test@example.com",
        password: "testing1234",
      },
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return 'Invalid credentials' and return status code 401", async () => {
      (
        AuthenticateUserService as jest.MockedClass<
          typeof AuthenticateUserService
        >
      ).mockImplementationOnce(() => ({
        execute: jest.fn().mockRejectedValue(new Error("Invalid credentials")),
      }));

      await UserController.authenticate(request as Request, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid credentials",
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

      await UserController.authenticate(request as Request, mockResponse);

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
});
