import { describe, expect, test, mock } from 'bun:test';
import { EmailRouteRepository } from '../src/repositories/email-route';
import { EmailRouteEntity } from '../src/entities/email-route';
import { EmailClass } from '@/enums/email-class';
import { IDatabase } from '../src/interfaces/database';

describe('EmailRouteRepository', () => {
  test('should include drop column when creating a route', async () => {
    const binds: unknown[] = [];
    const mockDb = {
      instance: () => ({
        prepare: mock(() => ({
          bind: mock((...args: unknown[]) => {
            binds.push(...args);
            return {
              run: mock(() => Promise.resolve({ success: true })),
            };
          }),
        })),
      }),
    } as unknown as IDatabase;

    const repository = new EmailRouteRepository(mockDb);
    const route = new EmailRouteEntity();
    route.userId = 1;
    route.email = 'inbox@example.com';
    route.destination = 'forward@example.com';
    route.type = EmailClass.OTP;
    route.enabled = true;
    route.drop = true;

    await repository.create(route);

    expect(binds).toEqual([1, 'inbox@example.com', 'forward@example.com', EmailClass.OTP, true, true]);
  });
});
