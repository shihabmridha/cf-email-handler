import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { AuthHandler } from './handlers/auth';
import { ApiContext } from './lib/types';

const app = new Hono<{ Bindings: CloudflareBindings }>();
const api = new Hono<{ Bindings: CloudflareBindings }>();

api.use('*', cors());

app.notFound((c: ApiContext) => c.text('You are lost!', 404));

api.post('/login', AuthHandler.login);

app.route('/api', api);

export default app;
