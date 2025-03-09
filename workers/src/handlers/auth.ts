import { LoginDto } from "@/shared/dtos/auth";
import { Hono } from "hono";
import { AppContext } from '../interfaces/context';

const app = new Hono<{ Bindings: AppContext }>();

app.post('/', async (c) => {
  const body = await c.req.json<LoginDto>();

  const authService = c.env.container.getAuthService();
  const token = await authService.login(body);

  return c.json({
    token,
  });
});

export default app;
