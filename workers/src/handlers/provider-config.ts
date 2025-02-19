import {Hono} from "hono";
import {ProviderConfigService} from "../services/provider/config";
import {ProviderConfigDto} from "@/shared/dtos/provider";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get('/', async (c) => {
  const providerService = new ProviderConfigService(c.env.DB);
  const providers = await providerService.getAll();

  return c.json({providers});
});

app.post('/', async (c) => {
  const providerService = new ProviderConfigService(c.env.DB);
  const body = await c.req.json<ProviderConfigDto>();

  const dto = await providerService.create(body);

  return c.json(dto, 201);
});

app.put('/:id', async (c) => {
  const providerService = new ProviderConfigService(c.env.DB);
  const body = await c.req.json<ProviderConfigDto>();

  const dto = await providerService.update(body.id, body);

  return c.json(dto, 201);
});

app.delete('/:id', async (c) => {
  const providerService = new ProviderConfigService(c.env.DB);
  const id = c.req.param('id');

  await providerService.delete(parseInt(id));

  return c.body(null, 204);
});

export default app;
