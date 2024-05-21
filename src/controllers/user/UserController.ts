import { Request, Response } from "express";
import { CreateUserService } from "../../service/users/CreateUserService";
import {
  EmailCreationNotifier,
  EmailUpdateNotifier,
} from "../../service/users/observers/EmailNotifier";
import { UpdateUserService } from "../../service/users/UpdateUserService";
import { ListUsersService } from "../../service/users/ListUsersService";
import { GetUserService } from "../../service/users/GetUserService";
import { DeleteUserService } from "../../service/users/DeleteUserService";
import { AuthenticateUserService } from "../../service/users/AuthenticateUserService";
import {
  DoesNotExistError,
  ForbiddenError,
  AlreadyExistsError,
} from "../../errors";

export default new (class UserController {
  async authenticate(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const authenticateUserService = new AuthenticateUserService();

      const { user, token } = await authenticateUserService.execute({
        email,
        password,
      });

      return res.status(200).json({ user, token });
    } catch (error) {
      if (error instanceof DoesNotExistError) {
        const { statusCode, statusMessage } = error;
        return res.status(statusCode).json({ error: statusMessage });
      }
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  }

  async create(req: Request, res: Response) {
    const authorization = req.headers.authorization;
    const { firstName, lastName, email, password, isActive, permissions } =
      req.body;
    try {
      const createUserService = new CreateUserService(
        new EmailCreationNotifier()
      );
      const userRequest = await createUserService.execute(authorization, {
        firstName,
        lastName,
        email,
        password,
        isActive,
        permissions,
      });

      return res.status(200).json(userRequest);
    } catch (error) {
      if (
        error instanceof ForbiddenError ||
        error instanceof AlreadyExistsError
      ) {
        const { statusCode, statusMessage } = error;
        return res.status(statusCode).json({ error: statusMessage });
      }
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  }

  async update(req: Request, res: Response) {
    const authorization = req.headers.authorization;
    const { id } = req.params;
    const { firstName, lastName, email, isActive, password, permissions } =
      req.body;
    try {
      const updateUserService = new UpdateUserService(
        new EmailUpdateNotifier()
      );

      const userRequest = await updateUserService.execute(authorization, {
        id,
        firstName,
        lastName,
        email,
        password,
        isActive,
        permissions,
      });

      return res.status(200).json(userRequest);
    } catch (error) {
      if (
        error instanceof ForbiddenError ||
        error instanceof DoesNotExistError ||
        error instanceof AlreadyExistsError
      ) {
        const { statusCode, statusMessage } = error;
        return res.status(statusCode).json({ error: statusMessage });
      }
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  }

  async get(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const authorization = req.headers.authorization;
      const getUserService = new GetUserService();

      const user = await getUserService.execute(authorization, { id });

      return res.status(200).json(user);
    } catch (error) {
      if (
        error instanceof ForbiddenError ||
        error instanceof DoesNotExistError
      ) {
        const { statusCode, statusMessage } = error;
        return res.status(statusCode).json({ error: statusMessage });
      }
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const authorization = req.headers.authorization;
      const { page, limit } = req.query;
      const parsedPage = parseInt(page as string);
      const parsedLimit = parseInt(limit as string);

      const listUsersService = new ListUsersService();

      const users = await listUsersService.execute(
        authorization,
        parsedPage,
        parsedLimit
      );

      return res.status(200).json(users);
    } catch (error) {
      if (
        error instanceof ForbiddenError ||
        error instanceof DoesNotExistError
      ) {
        const { statusCode, statusMessage } = error;
        return res.status(statusCode).json({ error: statusMessage });
      }
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  }

  async delete(req: Request, res: Response) {
    const authorization = req.headers.authorization;
    const { id } = req.params;
    try {
      const deleteUserService = new DeleteUserService();

      await deleteUserService.execute(authorization, {
        id,
      });

      return res.status(200).json({
        message: "Deleted successfully",
      });
    } catch (error) {
      if (
        error instanceof ForbiddenError ||
        error instanceof DoesNotExistError
      ) {
        const { statusCode, statusMessage } = error;
        return res.status(statusCode).json({ error: statusMessage });
      }
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  }
})();
