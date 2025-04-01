import { Hono } from "hono";
import { DraftDto } from "@/dtos/draft";
import { AppContext } from '../interfaces/context';
import { jwt, JwtVariables } from 'hono/jwt';
import type { JwtPayload } from '../services/auth';

const app = new Hono<{ Bindings: AppContext, Variables: JwtVariables<JwtPayload> }>();

app.use('*', async (c, next) => {
  const auth = jwt({
    secret: c.env.JWT_SECRET,
  });

  return auth(c, next);
});

app.get('/', async (c) => {
  const draftService = c.env.container.getDraftService();
  const drafts = await draftService.getAll();

  const payload = c.get('jwtPayload');

  return c.json({ drafts, payload });
});

app.post('/', async (c) => {
  const body = await c.req.json<DraftDto>();
  body.userId = c.get('jwtPayload')?.id;

  const draftService = c.env.container.getDraftService();
  await draftService.create(body);

  return c.body(null, 201);
});

app.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<DraftDto>();

  const draftService = c.env.container.getDraftService();
  await draftService.update(id, body);

  return c.body(null, 204);
});

app.delete('/:id', async (c) => {
  const id = c.req.param('id');

  const draftService = c.env.container.getDraftService();
  await draftService.delete(parseInt(id));

  return c.body(null, 204);
});

export default app;
