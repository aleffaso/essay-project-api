import { Router } from "express";
import UserController from "../../controllers/user/UserController";
import userAuthMiddleware from "../../middleware/userAuthMiddleware";

const userRouter = Router();
userRouter.post("/user/authenticate", UserController.authenticate);
userRouter.post("/user", userAuthMiddleware, UserController.create);
userRouter.get("/user/:id", userAuthMiddleware, UserController.get);
userRouter.put("/user/:id", userAuthMiddleware, UserController.update);
userRouter.delete("/user/:id", userAuthMiddleware, UserController.delete);
userRouter.get("/users", userAuthMiddleware, UserController.list);

export default userRouter;
