import {Hono} from 'hono';
import {cors} from 'hono/cors';
import {HTTPException} from "hono/http-exception";
import authHandler from './handlers/auth';
import draftHandler from "./handlers/draft";
import providerConfigHandler from "./handlers/provider-config";
import mailHandler from "./handlers/mail";

const app = new Hono<{ Bindings: CloudflareBindings }>();
app.notFound((c) => c.text('You are lost!', 404));

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({error: err.message}, err.status);
  } else {
    return c.json({error: 'Internal server error'}, 500);
  }
});

const api = new Hono<{ Bindings: CloudflareBindings }>();
api.use('*', cors());

api.route('/login', authHandler);
api.route('/drafts', draftHandler);
api.route('/provider-configs', providerConfigHandler);
api.route('/mail', mailHandler);

app.route('/api', api);


export default app;
