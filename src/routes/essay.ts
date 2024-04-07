import { Router } from "express";
import EssayController from "../controllers/EssayController";

const essayRouter = Router();
//TO DO: add middleware authentication
essayRouter.post("/essay", EssayController.create);
essayRouter.get("/essay/:id", EssayController.get);
essayRouter.put("/essay/:id", EssayController.update);
essayRouter.delete("/essay/:id", EssayController.delete);
essayRouter.get("/essays", EssayController.list);

export default essayRouter;
