import { Router } from "express";
import StudentController from "../controllers/StudentController";
import studentAuthMiddleware from "../middleware/studentAuthMiddleware";

const studentRouter = Router();
studentRouter.post("/student/authenticate", StudentController.authenticate);
studentRouter.post("/student", StudentController.create);
studentRouter.get("/student/:id", studentAuthMiddleware, StudentController.get);
studentRouter.put(
  "/student/:id",
  studentAuthMiddleware,
  StudentController.update
);
studentRouter.delete("/student/:id", StudentController.delete);
studentRouter.get("/students", StudentController.list);

export default studentRouter;
