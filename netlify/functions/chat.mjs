// Netlify Function — endpoint /api/chat (vía redirect en netlify.toml).
// Se mantiene por si despliegas en Netlify; la lógica vive en lib/chat-core.mjs.
import Anthropic from '@anthropic-ai/sdk';
import { validarPayload, runChat, origenPermitido } from '../../lib/chat-core.mjs';

const HAS_KEY = Boolean(process.env.ANTHROPIC_API_KEY);
const client = HAS_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const json = (status, body) => ({
  statusCode: status,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' });

  const origen = event.headers?.origin || event.headers?.referer;
  if (!origenPermitido(origen)) {
    return json(403, { error: 'forbidden_origin', message: 'Origen no permitido.' });
  }

  if (!client) {
    return json(503, {
      error: 'no_api_key',
      message: 'Falta variable de entorno ANTHROPIC_API_KEY en Netlify.',
    });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'bad_json' });
  }

  const v = validarPayload(payload);
  if (v.error) return json(v.status, { error: v.error });

  try {
    const data = await runChat(client, v);
    return json(200, { ok: true, ...data });
  } catch (err) {
    console.error('[chat fn]', err);
    return json(500, { error: 'server_error', message: err.message });
  }
};
