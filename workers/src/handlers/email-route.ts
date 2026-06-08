import { Hono } from 'hono';
import { JwtVariables } from 'hono/jwt';
import { EmailRouteDto } from '@/dtos/email-route';
import { AppContext } from '../interfaces/context';
import { createJwtAuth } from '../lib/jwt';
import type { JwtPayload } from '../services/auth';

const app = new Hono<{ Bindings: AppContext, Variables: JwtVariables<JwtPayload> }>();

app.use('*', async (c, next) => {
  return createJwtAuth(c.env.JWT_SECRET)(c, next);
});

app.get('/', async (c) => {
  const emailRouteService = c.env.container.getEmailRouteService();
  const routes = await emailRouteService.getAll();

  return c.json({ routes });
});

app.post('/', async (c) => {
  const body = await c.req.json<EmailRouteDto>();
  body.userId = c.get('jwtPayload')?.id;

  const emailRouteService = c.env.container.getEmailRouteService();
  await emailRouteService.create(body);

  return c.body(null, 201);
});

app.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<EmailRouteDto>();
  body.userId = c.get('jwtPayload')?.id;

  const emailRouteService = c.env.container.getEmailRouteService();
  await emailRouteService.update(parseInt(id), body);

  return c.body(null, 204);
});

app.delete('/:id', async (c) => {
  const id = c.req.param('id');

  const emailRouteService = c.env.container.getEmailRouteService();
  await emailRouteService.delete(parseInt(id));

  return c.body(null, 204);
});

export default app;
