// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Pool } from 'pg';
import { createDAO } from './dao/index.js';
import { makeAuthRouter } from './routes/auth.js';
import { makePostsRouter } from './routes/posts.js';
import { makeSession } from './session.js';

const app = express();
const PORT = process.env.PORT || 8000;
const USE_DB = String(process.env.USE_DB).toLowerCase() === 'true';

// CORS setup
app.use(
  cors({
    origin: [process.env.CLIENT_ORIGIN || 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  })
);

// Body parser + session middleware
app.use(bodyParser.json());
app.use(makeSession({ secret: process.env.SESSION_SECRET || 'dev_secret' }));

// PostgreSQL connection
let pgPool = null;
if (USE_DB) {
  pgPool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: Number(process.env.PGPORT || 5432),
  });

  // Optional: confirm DB connection at startup
  pgPool
    .connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch((err) => console.error(' PostgreSQL connection error:', err));
}

// DAO (switches between memory vs postgres)
const dao = createDAO({ useDb: USE_DB, pgPool });

// Health route
app.get('/api/health', (req, res) => res.json({ ok: true, use_db: USE_DB }));

// Auth & Posts routes
app.use('/api/auth', makeAuthRouter(dao));
app.use('/api/posts', makePostsRouter(dao));

// Optional: Debug route to check Postgres data
app.get('/api/debug/db', async (req, res) => {
  if (!USE_DB || !pgPool)
    return res.json({ use_db: false, message: 'Running in memory mode' });
  try {
    const { rows } = await pgPool.query('SELECT COUNT(*) FROM blogs');
    res.json({ use_db: true, blog_count: rows[0].count });
  } catch (err) {
    res.status(500).json({ use_db: true, error: err.message });
  }
});

// Start server
app.listen(PORT, () =>
  console.log(`Backend listening on http://localhost:${PORT} (USE_DB=${USE_DB})`)
);
