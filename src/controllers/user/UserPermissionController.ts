import { Request, Response } from "express";
import { CreateUserPermissionService } from "../../service/user-permissions/CreateUserPermissionService";

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
})();
