import { Request, Response } from "express";
import { HealthCheckService } from "../service/HealthCheckService";
import { ServiceUnavailableError } from "../errors";

class HealthCheckController {
  async healthCheck(req: Request, res: Response) {
    try {
      const healthCheckService = new HealthCheckService();

      const healthCheck = await healthCheckService.execute();

      return res.json(healthCheck);
    } catch (error) {
      if (error instanceof ServiceUnavailableError) {
        const { statusCode, statusMessage } = error;
        return res.status(statusCode).json({ error: statusMessage });
      }
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default new HealthCheckController();
