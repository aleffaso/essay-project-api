import { Router } from "express";
import PermissionController from "../../controllers/user/UserPermissionController";
import userAuthMiddleware from "../../middleware/userAuthMiddleware";

const userPermissionRouter = Router();
userPermissionRouter.post("/permission", PermissionController.create);
userPermissionRouter.get(
  "/permissions",
  userAuthMiddleware,
  PermissionController.list
);

export default userPermissionRouter;
