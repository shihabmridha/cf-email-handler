import {DraftService} from "../services/draft";
import {DraftDto} from "@/shared/dtos/draft";
import {Hono} from "hono";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get('/', async (c) => {
  const draftService = new DraftService(c.env.DB);
  const drafts = await draftService.getAll();

  return c.json({drafts});
});

app.post('/', async (c) => {
  const draftService = new DraftService(c.env.DB);
  const body = await c.req.json<DraftDto>();

  await draftService.create(body);

  return c.body(null, 201);
});

export default app;
