import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static'

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.get('/', async (c) => {
    return new Response('Hello world!')
})

export default app;