import { Hono } from 'hono';
import { cors } from 'hono/cors';
import userRoutes from './routes/users.js';

const app = new Hono();

// Middleware
app.use('/*', cors());

// Routes
app.route('/api', userRoutes);

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }));

const PORT = process.env.PORT || 3003;

console.log(`Hono server running on http://localhost:${PORT}`);

export default {
  port: PORT,
  fetch: app.fetch.bind(app),
} as unknown;
