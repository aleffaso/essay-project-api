import { Router } from "express";
import HealthCheckController from "../controllers/health-check/HealthCheckController";

const router = Router();

router.get("/", HealthCheckController.healthCheck);

export default router;
