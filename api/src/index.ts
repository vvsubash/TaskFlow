import { Hono } from 'hono'

const honoApp = new Hono().basePath('/api')
honoApp.get('/hello', (c) => c.text('Hello'))
honoApp.get('/health', (c) => c.text('OK'))

export default honoApp
