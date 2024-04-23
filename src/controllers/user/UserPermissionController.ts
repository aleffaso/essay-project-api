import { Request, Response } from "express";
import { CreateUserPermissionService } from "../../service/user-permissions/CreateUserPermissionService";
import { ListUserPermissionsService } from "../../service/user-permissions/ListUserPermissionsService";
import {
  AlreadyExistsError,
  DoesNotExistError,
  ForbiddenError,
} from "../../errors";

export default new (class UserPermissionController {
  async create(req: Request, res: Response) {
    const authorization = req.headers.authorization;
    const { type } = req.body;
    try {
      const createUserPermissionService = new CreateUserPermissionService();
      const userPermissionRequest = await createUserPermissionService.execute(
        authorization,
        {
          type,
        }
      );

      return res.status(200).json(userPermissionRequest);
    } catch (error) {
      if (
        error instanceof DoesNotExistError ||
        error instanceof ForbiddenError ||
        error instanceof AlreadyExistsError
      ) {
        const { statusCode, statusMessage } = error;
        return res.status(statusCode).json({ error: statusMessage });
      }
      return res.status(500).json({ error: "Internal Server Error" });
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

      return res.status(200).json(permissions);
    } catch (error) {
      if (
        error instanceof DoesNotExistError ||
        error instanceof ForbiddenError
      ) {
        const { statusCode, statusMessage } = error;
        return res.status(statusCode).json({ error: statusMessage });
      }
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
})();
