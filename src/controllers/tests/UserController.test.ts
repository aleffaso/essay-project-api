import { Request, Response } from "express";
import UserController from "../user/UserController";
import { AuthenticateUserService } from "../../service/users/AuthenticateUserService";

jest.mock("../../service/users/AuthenticateUserService");

describe("UserController", () => {
  describe("authenticate", () => {
    const requestBody = {
      email: "test@example.com",
      password: "testing1234",
    };

    const expectedUser = {
      id: "ec71bc...",
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      permissions: ["admin"],
    };
    const expectedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....";

    it("should authenticate user and status code 200", async () => {
      (
        AuthenticateUserService as jest.MockedClass<
          typeof AuthenticateUserService
        >
      ).mockImplementationOnce(() => ({
        execute: jest.fn().mockResolvedValueOnce({
          user: expectedUser,
          token: expectedToken,
        }),
      }));

      const response: Partial<Response> = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await UserController.authenticate(
        { body: requestBody } as Request,
        response as Response
      );

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        user: expectedUser,
        token: expectedToken,
      });
    });

    it("should return 'Invalid credentials' and status code 401", async () => {
      (
        AuthenticateUserService as jest.MockedClass<
          typeof AuthenticateUserService
        >
      ).mockImplementationOnce(() => ({
        execute: jest
          .fn()
          .mockRejectedValueOnce(new Error("Invalid credentials")),
      }));

      const response: Partial<Response> = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await UserController.authenticate(
        { body: requestBody } as Request,
        response as Response
      );

      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith({
        error: "Invalid credentials",
      });
    });
  });
});
