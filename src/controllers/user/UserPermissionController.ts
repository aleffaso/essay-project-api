import { Request, Response } from "express";
import { CreateUserPermissionService } from "../../service/user-permissions/CreateUserPermissionService";
import { ListUserPermissionsService } from "../../service/user-permissions/ListUserPermissionsService";

export default new (class UserPermissionController {
  async create(req: Request, res: Response) {
    const { type } = req.body;
    try {
      const createUserPermissionService = new CreateUserPermissionService();
      const userPermissionRequest = await createUserPermissionService.execute({
        type,
      });

      return res.json(userPermissionRequest);
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

      const listUserPermissionsService = new ListUserPermissionsService();

      const permissions = await listUserPermissionsService.execute(
        authorization,
        parsedPage,
        parsedLimit
      );

      return res.json(permissions);
    } catch (error) {
      res.json({ error: error });
    }
  }
})();
