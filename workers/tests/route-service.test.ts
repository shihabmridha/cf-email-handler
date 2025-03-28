import { expect, test, describe, mock } from "bun:test";
import config from '../wrangler.toml';
import { WranglerConfig } from "../src/interfaces/wrangler-config.js";
const wranglerConfig = config as WranglerConfig;

import { EmailClass } from "@/enums/email-class";
import { EmailRouteService } from "../src/services/email-route";
import { Configuration } from "../src/config";
import { IEmailRouteRepository } from "../src/interfaces/repositories/email-route";
import { EmailRouteEntity } from "../src/entities/email-route";


describe.skip("Route Service", () => {
  test("should get unknown destination when no route is found", async () => {
    const env = {
      ...wranglerConfig.vars
    };
    const config = new Configuration(env);

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

    const routeService = new EmailRouteService(config, mockEmailRouteRepository);
    const destination = await routeService.getDestination("test@test.com", EmailClass.OTP);
    expect(destination).toBe("unknown@test.com");
  });
});
