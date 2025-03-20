import { Hono } from "hono";
import { jwt } from 'hono/jwt';
import { ProviderConfigDto } from "@/dtos/provider";
import { AppContext } from '../interfaces/context';

const app = new Hono<{ Bindings: AppContext }>();
app.use('*', async (c, next) => {
  const auth = jwt({
    secret: c.env.JWT_SECRET,
  });

  return auth(c, next);
});

app.get('/', async (c) => {
  const providerService = c.env.container.getProviderConfigService();
  const providers = await providerService.getAll();

  return c.json({ providers });
});

app.post('/', async (c) => {
  const body = await c.req.json<ProviderConfigDto>();

  const providerService = c.env.container.getProviderConfigService();
  const dto = await providerService.create(body);

  return c.json(dto, 201);
});

app.put('/:id', async (c) => {
  const body = await c.req.json<ProviderConfigDto>();

  const providerService = c.env.container.getProviderConfigService();
  const dto = await providerService.update(body.id, body);

  return c.json(dto, 201);
});

app.delete('/:id', async (c) => {
  const id = c.req.param('id');

  const providerService = c.env.container.getProviderConfigService();
  await providerService.delete(parseInt(id));

  return c.body(null, 204);
});

export default app;
