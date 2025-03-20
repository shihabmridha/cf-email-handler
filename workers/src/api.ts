import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from "hono/http-exception";
import authHandler from './handlers/auth';
import draftHandler from "./handlers/draft";
import providerConfigHandler from "./handlers/provider-config";
import emailHandler from "./handlers/mail";
import emailRouteHandler from "./handlers/email-route";
import configHandler from "./handlers/config";
import { Container } from './container';
import { AppContext } from './interfaces/context';

const app = new Hono<{ Bindings: Env }>();
app.notFound((c) => c.text('You are lost!', 404));

app.onError((err, c) => {
  console.error(err);

  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  } else {
    return c.json({ error: 'Internal server error' }, 500);
  }
});

const api = new Hono<{ Bindings: AppContext }>();
api.use('*', cors());

// Create DI Container
api.use('*', async (c, next) => {
  c.env.container = new Container(c.env);
  await next();
});

api.route('/login', authHandler);
api.route('/drafts', draftHandler);
api.route('/provider-configs', providerConfigHandler);
api.route('/email', emailHandler);
api.route('/email-route', emailRouteHandler);
api.route('/config', configHandler);

app.route('/api', api);

export default app;
