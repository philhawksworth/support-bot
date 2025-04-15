import { Hono } from 'npm:hono'
const app = new Hono()

app.get('/', (c) => {
  console.log("GET /");
  return c.text('Hello, support bot!')
})

app.post('/new', async (c) => {
  const data = await c.req.json()
  console.log("POST /new", data);
  return c.text('POST /new')
})

Deno.serve({ port: 8000 }, app.fetch) 