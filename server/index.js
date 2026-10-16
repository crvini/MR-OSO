// Backend local para desarrollo (npm run dev:all).
// En producción este archivo NO corre: lo reemplaza api/chat.js (Vercel)
// o netlify/functions/chat.mjs (Netlify). La lógica vive en lib/chat-core.mjs.
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { validarPayload, runChat } from '../lib/chat-core.mjs';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || true }));
app.use(express.json({ limit: '300kb' }));

const PORT = process.env.PORT || 3001;
const HAS_KEY = Boolean(process.env.ANTHROPIC_API_KEY);

const client = HAS_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, hasKey: HAS_KEY });
});

app.post('/api/chat', async (req, res) => {
  if (!client) {
    return res.status(503).json({
      error: 'no_api_key',
      message: 'Falta ANTHROPIC_API_KEY en .env',
    });
  }

  const v = validarPayload(req.body);
  if (v.error) return res.status(v.status).json({ error: v.error });

  try {
    const data = await runChat(client, v);
    res.json({ ok: true, ...data });
  } catch (err) {
    console.error('[chat] error', err);
    res.status(500).json({ error: 'server_error', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(
    `[mr-oso ai] listening on http://localhost:${PORT} (apiKey: ${
      HAS_KEY ? 'ok' : 'MISSING'
    })`,
  );
});
