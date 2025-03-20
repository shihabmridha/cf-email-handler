import { Hono } from "hono";
import { DraftDto } from "@/dtos/draft";
import { AppContext } from '../interfaces/context';
import { jwt } from 'hono/jwt';

const app = new Hono<{ Bindings: AppContext }>();

app.use('*', async (c, next) => {
  const auth = jwt({
    secret: c.env.JWT_SECRET,
  });

  return auth(c, next);
});

app.get('/', async (c) => {
  const draftService = c.env.container.getDraftService();
  const drafts = await draftService.getAll();

  return c.json({ drafts });
});

app.post('/', async (c) => {
  const body = await c.req.json<DraftDto>();
  body.id = c.get('jwtPayload')?.id as number;

  const draftService = c.env.container.getDraftService();
  const dto = await draftService.create(body);

  return c.json(dto, 201);
});

app.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<DraftDto>();

  const draftService = c.env.container.getDraftService();
  const dto = await draftService.update(id, body);

  return c.json(dto, 201);
});

app.delete('/:id', async (c) => {
  const id = c.req.param('id');

  const draftService = c.env.container.getDraftService();
  await draftService.delete(parseInt(id));

  return c.body(null, 204);
});

export default app;
