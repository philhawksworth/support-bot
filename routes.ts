import { Hono } from 'npm:hono'
const app = new Hono()

app.get('/', (c) => {
  console.log("GET /");
  c.status(200);
  return c.text('Hello, support bot!')
})

app.post('/new', async (c) => {
  const data = await c.req.json()
  console.log("POST /new", data);
  c.status(200);
  return c.text('POST /new')
})

app.get('/auth/new', (c) => {
  console.log("GET /auth/new");
  c.status(200); 
  return c.text('GET /auth/new')
})


Deno.serve({ port: 8000 }, app.fetch) 



