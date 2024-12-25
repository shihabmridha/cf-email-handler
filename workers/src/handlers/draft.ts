import {DraftService} from "../services/draft";
import {DraftDto} from "@/shared/dtos/draft";
import {Hono} from "hono";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get('/', async (c) => {
  const draftService = new DraftService(c.env.DB);
  const drafts = await draftService.getAll();

  return c.json({drafts});
});

app.post('/', async (c) => {
  const draftService = new DraftService(c.env.DB);
  const body = await c.req.json<DraftDto>();

  const dto = await draftService.create(body);

  return c.json(dto, 201);
});

app.put('/:id', async (c) => {
  const draftService = new DraftService(c.env.DB);
  const id = c.req.param('id');
  const body = await c.req.json<DraftDto>();

  const dto = await draftService.update(id, body);

  return c.json(dto, 201);
});

app.delete('/:id', async (c) => {
  const draftService = new DraftService(c.env.DB);
  const id = c.req.param('id');

  await draftService.delete(parseInt(id));

  return c.body(null, 204);
});

export default app;
