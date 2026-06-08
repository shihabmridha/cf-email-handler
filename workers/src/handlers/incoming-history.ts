import { Hono } from 'hono';
import { AppContext } from '../interfaces/context';
import { IncomingHistoryDto } from '@/dtos/incoming-history';
import { createJwtAuth } from '../lib/jwt';

const app = new Hono<{ Bindings: AppContext }>();

app.use('*', async (c, next) => {
  return createJwtAuth(c.env.JWT_SECRET)(c, next);
});

app.get('/', async (c) => {
  const page = c.req.query('page');
  const service = c.env.container.getIncomingHistoryService();
  const histories = await service.getByPage(parseInt(page || '1'));

  return c.json({ histories });
});

app.post('/', async (c) => {
  const body = await c.req.json<IncomingHistoryDto>();
  const service = c.env.container.getIncomingHistoryService();
  await service.create(body);

  return c.body(null, 201);
});


export default app;
