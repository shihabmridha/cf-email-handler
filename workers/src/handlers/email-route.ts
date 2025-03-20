import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { EmailRouteDto } from '@/shared/dtos/email-route';
import { AppContext } from '../interfaces/context';

const app = new Hono<{ Bindings: AppContext }>();

app.use('*', async (c, next) => {
  const auth = jwt({
    secret: c.env.JWT_SECRET,
  });

  return auth(c, next);
});

app.get('/', async (c) => {
  const emailRouteService = c.env.container.getEmailRouteService();
  const routes = await emailRouteService.getAll();

  return c.json({ routes });
});

app.post('/', async (c) => {
  const body = await c.req.json<EmailRouteDto>();
  body.userId = c.get('jwtPayload')?.id as number;

  const emailRouteService = c.env.container.getEmailRouteService();
  await emailRouteService.create(body);

  return c.body(null, 201);
});

app.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<EmailRouteDto>();
  body.userId = c.get('jwtPayload')?.id as number;

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
