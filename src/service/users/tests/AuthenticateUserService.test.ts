import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { DoesNotExistError } from "../../../errors";
import { AuthenticateUserService } from "../AuthenticateUserService";

const userResponse = {
  user: {
    id: "ec71bc...",
    firstName: "Test",
    lastName: "User",
    email: "valid@example.com",
    password: "password",
    isActive: true,
    permissions: [{ id: "ufehuehf...", type: "ADMIN" }],
  },
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....",
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST on /user/authenticate using UserService", () => {
  it("throws error for invalid email", async () => {
    jest
      .spyOn(require("../../../data-source.ts").AppDataSource, "getRepository")
      .mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null),
      });

    const authenticateUserService = new AuthenticateUserService();

    await expect(
      authenticateUserService.execute({
        email: "invalid@example.com",
        password: "password",
      })
    ).rejects.toThrow(DoesNotExistError);
  });

  it("throws error for invalid password", async () => {
    jest
      .spyOn(require("../../../data-source.ts").AppDataSource, "getRepository")
      .mockReturnValue({
        findOne: jest.fn().mockResolvedValue(userResponse.user),
      });

    const bcryptCompare = jest.fn().mockResolvedValue(false);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const authenticateUserService = new AuthenticateUserService();

    await expect(
      authenticateUserService.execute({
        email: "valid@example.com",
        password: "wrong_password",
      })
    ).rejects.toThrow(DoesNotExistError);
  });

  it("throws user and token response", async () => {
    jest
      .spyOn(require("../../../data-source.ts").AppDataSource, "getRepository")
      .mockReturnValue({
        findOne: jest.fn().mockResolvedValue(userResponse.user),
      });

    const bcryptCompare = jest.fn().mockResolvedValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const jwtSign = jest.fn().mockReturnValue(userResponse.token);
    (jwt as any).sign = jwtSign;

    const authenticateUserService = new AuthenticateUserService();

    const userRequest = await authenticateUserService.execute({
      email: "valid@example.com",
      password: "hashed_password",
    });

    expect(userRequest).toEqual(
      expect.objectContaining({
        user: {
          id: userResponse.user.id,
          firstName: userResponse.user.firstName,
          lastName: userResponse.user.lastName,
          email: userResponse.user.email,
          permissions: userResponse.user.permissions.map(
            (permission) => permission.type
          ),
        },
        token: userResponse.token,
      })
    );
  });
});
