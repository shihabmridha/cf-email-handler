import { Hono } from "hono";
import { AppContext } from '../interfaces/context';

const app = new Hono<{ Bindings: AppContext }>();

app.get('/forward-to', async (c) => {
    const config = c.env.container.getConfig();

    return c.json({
        email: config.emailForwardTo,
    });
});

export default app;
