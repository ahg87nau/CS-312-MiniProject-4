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


app.use(cors({
origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
credentials: true
}));
app.use(bodyParser.json());
app.use(makeSession({ secret: process.env.SESSION_SECRET || 'dev_secret' }));


let pgPool = null;
if (USE_DB) {
pgPool = new Pool({
user: process.env.PGUSER,
password: process.env.PGPASSWORD,
host: process.env.PGHOST,
database: process.env.PGDATABASE,
port: Number(process.env.PGPORT || 5432)
});
}


const dao = createDAO({ useDb: USE_DB, pgPool });


app.get('/api/health', (req, res) => res.json({ ok: true, use_db: USE_DB }));
app.use('/api/auth', makeAuthRouter(dao));
app.use('/api/posts', makePostsRouter(dao));


app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT} (USE_DB=${USE_DB})`));