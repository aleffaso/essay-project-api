import { Router } from "express";
import UserController from "../controllers/UserController";

const userRouter = Router();
//TO DO: add middleware authentication
userRouter.post("/user", UserController.create);
userRouter.get("/user/:id", UserController.get);
userRouter.put("/user/:id", UserController.update);
userRouter.delete("/user/:id", UserController.delete);
userRouter.get("/users", UserController.list);

export default userRouter;
