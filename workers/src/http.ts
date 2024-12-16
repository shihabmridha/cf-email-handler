import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.use('/api/*', cors())
app.post('/api/auth', async (c) => {
    const body = await c.req.json();
    console.log(body);
    return new Response('Hello world!')
})

export default app;