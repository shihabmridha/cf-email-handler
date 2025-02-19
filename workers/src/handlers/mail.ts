import {Hono} from "hono";
import {MailService} from "../services/mail";
import {SendMailDto} from "@/shared/dtos/mail";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.post('/send', async (c) => {
  const mailService = new MailService(c.env.DB);
  const body = await c.req.json<SendMailDto>();

  const dto = await mailService.send(body);

  return c.json(dto, 201);
});

export default app;
