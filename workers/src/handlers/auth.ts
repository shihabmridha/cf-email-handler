import { ApiContext } from "../lib/types";
import { AuthService } from "../services/auth";

export class AuthHandler {
  static async login(c: ApiContext): Promise<Response> {
    const body = await c.req.json();
    // console.log(body);

    const authService = new AuthService(c.env.DB, c.env.JWT_SECRET);
    const token = await authService.login(body.email, body.password);

    return c.json({
      token,
    });
  }
}
