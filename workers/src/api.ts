﻿import { Hono } from 'hono';
import { cors } from 'hono/cors';
import authHandler from './handlers/auth';
import draftHandler from "./handlers/draft";

const app = new Hono<{ Bindings: CloudflareBindings }>();
app.notFound((c) => c.text('You are lost!', 404));

const api = new Hono<{ Bindings: CloudflareBindings }>();
api.use('*', cors());

api.route('/login', authHandler);
api.route('/drafts', draftHandler);

app.route('/api', api);

export default app;