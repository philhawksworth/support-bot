import { Hono } from 'npm:hono'
const app = new Hono()

app.get('/', (c) => {
  console.log("GET /", c);
  return c.text('Hello, support bot!')
})

app.post('/new', (c) => {
  console.log("POST /new", c);
  return c.text('POST /new')
})

Deno.serve({ port: 8000 }, app.fetch) 