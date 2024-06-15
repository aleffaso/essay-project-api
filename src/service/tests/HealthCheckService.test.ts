import { ServiceUnavailableError } from "../../errors";
import { HealthCheckService } from "../HealthCheckService";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET on / using HealthCheckService", () => {
  it("throws error: Service Unavailable", async () => {
    const healthCheckService = new HealthCheckService();

    await expect(healthCheckService.execute()).rejects.toThrow(
      ServiceUnavailableError
    );
  });
});
