import { LoginDto } from "@/dtos/auth";
import { Hono } from "hono";
import { AppContext } from '../interfaces/context';
import { createJwtAuth } from '../lib/jwt';

const app = new Hono<{ Bindings: AppContext }>();

app.post('/login', async (c) => {
  const body = await c.req.json<LoginDto>();

  const authService = c.env.container.getAuthService();
  const token = await authService.login(body);

  return c.json({
    token,
  });
});


app.use('/verify', async (c, next) => {
  return createJwtAuth(c.env.JWT_SECRET)(c, next);
});

app.get('/verify', async (c) => {
  return c.body(null, 200);
});

export default app;
