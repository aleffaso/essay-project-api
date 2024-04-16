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

export default new (class UserController {
  async authenticate(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const authenticateStudentService = new AuthenticateUserService();

      const authenticate = await authenticateStudentService.execute({
        email,
        password,
      });

      return res.json(authenticate);
    } catch (error) {
      res.json({ error: error });
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

      return res.json(userRequest);
    } catch (error) {
      res.json({ error: error });
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

      return res.json(userRequest);
    } catch (error) {
      res.json({ error: error });
    }
  }

  async get(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const authorization = req.headers.authorization;
      const getUserService = new GetUserService();

      const user = await getUserService.execute(authorization, { id });

      return res.json(user);
    } catch (error) {
      res.json({ error: error });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const authorization = req.headers.authorization;
      const { page = 1, limit = 10 } = req.query;
      const parsedPage = parseInt(page as string);
      const parsedLimit = parseInt(limit as string);

      const listUsersService = new ListUsersService();

      const users = await listUsersService.execute(
        authorization,
        parsedPage,
        parsedLimit
      );

      return res.json(users);
    } catch (error) {
      res.json({ error: error });
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
      res.json({ error: error });
    }
  }
})();
