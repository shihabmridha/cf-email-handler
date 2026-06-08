import { Hono } from "hono";
import { SendMailDto } from "@/dtos/mail";
import { AppContext } from '../interfaces/context';
import { createJwtAuth } from '../lib/jwt';

const app = new Hono<{ Bindings: AppContext }>();

app.use('*', async (c, next) => {
  return createJwtAuth(c.env.JWT_SECRET)(c, next);
});

app.post('/send', async (c) => {
  const mailService = c.env.container.getMailService();
  const emailRouteService = c.env.container.getEmailRouteService();
  const body = await c.req.json<SendMailDto>();

  const sent = await mailService.send(body);

  if (!sent) {
    return c.json({ error: 'Failed to send email' }, 500);
  }

  for (const recipient of body.content.to) {
    try {
      await emailRouteService.incrementSentByEmail(recipient);
    } catch (error) {
      console.error(`Failed to increment sent counter for ${recipient}:`, error);
    }
  }

  return c.json({ message: 'Email sent successfully' }, 200);
});

export default app;
