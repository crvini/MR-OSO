// Vercel Serverless Function — endpoint /api/chat
// Vercel enruta automáticamente api/chat.js -> /api/chat
import Anthropic from '@anthropic-ai/sdk';
import { validarPayload, runChat, origenPermitido } from '../lib/chat-core.mjs';

export const config = { maxDuration: 30 };

const HAS_KEY = Boolean(process.env.ANTHROPIC_API_KEY);
const client = HAS_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  if (!origenPermitido(req.headers.origin || req.headers.referer)) {
    return res.status(403).json({
      error: 'forbidden_origin',
      message: 'Origen no permitido.',
    });
  }

  if (!client) {
    return res.status(503).json({
      error: 'no_api_key',
      message: 'Falta la variable de entorno ANTHROPIC_API_KEY en Vercel.',
    });
  }

  const v = validarPayload(req.body);
  if (v.error) return res.status(v.status).json({ error: v.error });

  try {
    const data = await runChat(client, v);
    return res.status(200).json({ ok: true, ...data });
  } catch (err) {
    console.error('[api/chat]', err);
    return res.status(500).json({ error: 'server_error', message: err.message });
  }
}
