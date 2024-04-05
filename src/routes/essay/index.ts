import { Router } from "express";
import EssayController from "../../controllers/essay/EssayController";

const essayRouter = Router();
//TO DO: add middleware authentication
essayRouter.post("/essay", EssayController.create);
essayRouter.put("/essay/:id", EssayController.update);
essayRouter.get("/essays", EssayController.list);
essayRouter.delete("/essay/:id", EssayController.delete);

export default essayRouter;
