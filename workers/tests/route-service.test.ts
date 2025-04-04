import { expect, test, describe, mock } from "bun:test";
import { EmailClass } from "@/enums/email-class";
import { EmailRouteService } from "../src/services/email-route";
import { IEmailRouteRepository } from "../src/interfaces/repositories/email-route";
import { EmailRouteEntity } from "../src/entities/email-route";
import { ISettingsRepository } from "@/interfaces/repositories/settings";

describe.skip("Route Service", () => {
  test("should get unknown destination when no route is found", async () => {

    const mockEmailRouteRepository = {
      getByEmail: mock(() => {
        const entities: EmailRouteEntity[] = [
          {
            id: 1,
            email: "test@test.com",
            type: EmailClass.INVOICE,
            destination: "invoice@test.com",
            userId: 1,
            enabled: true,
            drop: false,
            received: 0,
            sent: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 2,
            email: "test@test.com",
            type: EmailClass.UNKNOWN,
            destination: "unknown@test.com",
            userId: 1,
            enabled: true,
            drop: false,
            received: 0,
            sent: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        return Promise.resolve(entities);
      }),
    } as unknown as IEmailRouteRepository;

    const mockSettingsRepository = {
      getByKey: mock(() => {
        return Promise.resolve({ value: "forward@test.com" });
      }),
    } as unknown as ISettingsRepository;

    const routeService = new EmailRouteService(mockEmailRouteRepository, mockSettingsRepository);
    const destination = await routeService.getDestination("test@test.com", EmailClass.OTP);
    expect(destination).toBe("unknown@test.com");
  });
});
