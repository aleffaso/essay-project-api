import { AppDataSource } from "../data-source";
import { ServiceUnavailableError } from "../errors";

export class HealthCheckService {
  async execute() {
    try {
      const repo = AppDataSource.isInitialized;
      if (!repo) {
        throw new ServiceUnavailableError("Service Unavailable");
      }
      return { message: "API online", status_code: 200 };
    } catch (error) {
      throw error;
    }
  }
}