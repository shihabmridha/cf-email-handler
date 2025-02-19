import { AuthService } from "../services/auth";
import {LoginDto} from "@/shared/dtos/auth";
import {Hono} from "hono";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.post('/', async (c) => {
  const body = await c.req.json<LoginDto>();

  const authService = new AuthService(c.env.DB, c.env.JWT_SECRET);
  const token = await authService.login(body);

  return c.json({
    token,
  });
});

export default app;
