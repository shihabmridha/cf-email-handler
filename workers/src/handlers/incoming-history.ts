import { Hono } from 'hono';
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
  const page = c.req.query('page');
  const service = c.env.container.getIncomingHistoryService();
  const histories = await service.getByPage(parseInt(page || '1'));

  return c.json({ histories });
});


export default app;
