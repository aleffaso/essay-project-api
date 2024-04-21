import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { DoesNotExistError } from "../../../errors";
import { AuthenticateUserService } from "../AuthenticateUserService";

jest.mock("../../../data-source.ts", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null),
    }),
  },
}));

const expectedValue = {
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
    const bcryptCompare = jest.fn().mockResolvedValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const authenticateUserService = new AuthenticateUserService();

    await expect(
      authenticateUserService.execute({
        email: "invalid@example.com",
        password: "password",
      })
    ).rejects.toThrow(DoesNotExistError);
  });

  it("throws error for invalid password", async () => {
    const bcryptCompare = jest.fn().mockResolvedValue(false);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    jest
      .spyOn(require("../../../data-source.ts").AppDataSource, "getRepository")
      .mockReturnValue({
        findOne: jest.fn().mockResolvedValue(expectedValue.user),
      });

    const authenticateUserService = new AuthenticateUserService();

    await expect(
      authenticateUserService.execute({
        email: "valid@example.com",
        password: "wrong_password",
      })
    ).rejects.toThrow(DoesNotExistError);
  });

  it("throws user and token response", async () => {
    const bcryptCompare = jest.fn().mockResolvedValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const jwtSign = jest.fn().mockReturnValue(expectedValue.token);
    (jwt as any).sign = jwtSign;

    jest
      .spyOn(require("../../../data-source.ts").AppDataSource, "getRepository")
      .mockReturnValue({
        findOne: jest.fn().mockResolvedValue(expectedValue.user),
      });

    const authenticateUserService = new AuthenticateUserService();

    const result = await authenticateUserService.execute({
      email: "valid@example.com",
      password: "hashed_password",
    });

    expect(result).toEqual(
      expect.objectContaining({
        user: {
          id: expectedValue.user.id,
          firstName: expectedValue.user.firstName,
          lastName: expectedValue.user.lastName,
          email: expectedValue.user.email,
          permissions: expectedValue.user.permissions.map(
            (permission) => permission.type
          ),
        },
        token: expectedValue.token,
      })
    );
  });
});
