import { Hono } from 'hono';
import { AppContext } from '../interfaces/context';
import { SettingsDto } from '../dtos/settings';
import { createJwtAuth } from '../lib/jwt';

const app = new Hono<{ Bindings: AppContext }>();

app.use('*', async (c, next) => {
  return createJwtAuth(c.env.JWT_SECRET)(c, next);
});

app.get('/', async (c) => {
  const service = c.env.container.getSettingsService();
  const settings = await service.getAll();

  return c.json({ settings });
});

app.get('/:key', async (c) => {
  const key = c.req.param('key');
  const service = c.env.container.getSettingsService();
  const setting = await service.getByKey(key);

  if (!setting) {
    return c.body(null, 404);
  }

  return c.json(setting);
});

app.put('/', async (c) => {
  const body = await c.req.json<SettingsDto>();
  const service = c.env.container.getSettingsService();
  await service.upsert(body);

  return c.body(null, 204);
});

app.delete('/:key', async (c) => {
  const key = c.req.param('key');
  const service = c.env.container.getSettingsService();
  await service.delete(key);

  return c.body(null, 204);
});

export default app;
