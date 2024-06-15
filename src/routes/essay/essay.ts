import { Router } from "express";
import EssayController from "../../controllers/essay/EssayController";
import userAuthMiddleware from "../../middleware/userAuthMiddleware";

const essayRouter = Router();
essayRouter.post("/essay", userAuthMiddleware, EssayController.create);
essayRouter.get("/essay/:id", userAuthMiddleware, EssayController.get);
essayRouter.put("/essay/:id", userAuthMiddleware, EssayController.update);
essayRouter.delete("/essay/:id", userAuthMiddleware, EssayController.delete);
essayRouter.get("/essays", userAuthMiddleware, EssayController.list);

export default essayRouter;
