import { Request, Response } from "express";
import { CreateUserService } from "../../service/users/CreateUserService";
import {
  EmailCreationNotifier,
  EmailUpdateNotifier,
} from "../../service/users/observers/EmailNotifier";
import { UpdateUserService } from "../../service/users/UpdateUserService";
import { ListUsersService } from "../../service/users/ListUsersService";
import { GetUserService } from "../../service/users/GetUserService";

const createUserService = new CreateUserService(new EmailCreationNotifier());
const updateUserService = new UpdateUserService(new EmailUpdateNotifier());

export default new (class UserController {
  async authenticate(req: Request, res: Response) {}

  async create(req: Request, res: Response) {
    const { name, email, admin, is_active, password } = req.body;
    try {
      const userRequest = await createUserService.execute({
        name,
        email,
        admin,
        password,
        is_active,
      });

      return res.json(userRequest);
    } catch (error) {
      res.json({ error: error });
    }
  }
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email, admin, is_active, password } = req.body;
    try {
      const userRequest = await updateUserService.execute({
        id,
        name,
        email,
        admin,
        is_active,
        password,
      });

      return res.json(userRequest);
    } catch (error) {
      res.json({ error: error });
    }
  }

  async get(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const getUserService = new GetUserService();

      const user = await getUserService.execute({ id });

      return res.json(user);
    } catch (error) {
      res.json({ error: error });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const parsedPage = parseInt(page as string);
      const parsedLimit = parseInt(limit as string);

      const listUsersService = new ListUsersService();

      const users = await listUsersService.execute(parsedPage, parsedLimit);

      return res.json(users);
    } catch (error) {
      res.json({ error: error });
    }
  }
  async delete(req: Request, res: Response) {}
})();
