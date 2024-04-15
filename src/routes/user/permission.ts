import { Router } from "express";
import PermissionController from "../../controllers/user/UserPermissionController";
//import userAuthMiddleware from "../../middleware/userAuthMiddleware";

const userPermissionRouter = Router();
userPermissionRouter.post("/permission", PermissionController.create);
// permissionRouter.get("/permission/:id", PermissionController.get);
// permissionRouter.put("/permission/:id", PermissionController.update);
// permissionRouter.delete("/permission/:id", PermissionController.delete);
// permissionRouter.get("/permissions", PermissionController.list);

export default userPermissionRouter;
