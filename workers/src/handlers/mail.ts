﻿import { Hono } from "hono";
import { jwt } from 'hono/jwt';
import { SendMailDto } from "@/dtos/mail";
import { AppContext } from '../interfaces/context';

const app = new Hono<{ Bindings: AppContext }>();

app.use('*', async (c, next) => {
  const auth = jwt({
    secret: c.env.JWT_SECRET,
  });

  return auth(c, next);
});

app.post('/send', async (c) => {
  const mailService = c.env.container.getMailService();
  const body = await c.req.json<SendMailDto>();

  const sent = await mailService.send(body);

  if (!sent) {
    return c.json({ error: 'Failed to send email' }, 500);
  }

  return c.json({ message: 'Email sent successfully' }, 200);
});

export default app;
