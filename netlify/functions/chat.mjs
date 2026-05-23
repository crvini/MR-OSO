// Netlify Function — espejo de server/index.js (endpoint /api/chat)
// Se invoca vía redirect en netlify.toml: /api/chat -> /.netlify/functions/chat
import Anthropic from '@anthropic-ai/sdk';

const SCOPE_RULES = `Eres un asesor de negocios para "Mr. Oso", un autolavado en Guatemala.

REGLAS ESTRICTAS DE SCOPE (no las rompas nunca):
- Respondes ÚNICAMENTE preguntas sobre ESTE negocio de autolavado: operaciones, ingresos, servicios, clientes, empleados, turnos, métricas, marketing, fidelización, precios, mejoras del negocio y qué se hizo / qué se puede hacer para mejorarlo.
- Si el usuario te pregunta CUALQUIER cosa fuera de ese alcance (programación, código, política, vida personal, otros negocios, recetas, deportes, temas generales, traducciones, chistes, etc.), respondes EXACTAMENTE este texto y nada más:
  "Solo puedo ayudarte con preguntas sobre tu negocio de autolavado o cómo mejorarlo."
- No inventes datos: usa solo las métricas dadas. Si no tienes el dato, dilo brevemente.
- Responde en español, claro, conciso y accionable. Moneda Q (quetzales).

FORMATO DE RESPUESTA — SIEMPRE devuelves JSON válido con esta forma exacta:
{
  "reply": "tu respuesta para el dueño, en texto plano, puedes usar saltos de línea",
  "preguntasSugeridas": ["pregunta 1", "pregunta 2", "pregunta 3"]
}

- "preguntasSugeridas" son 3 preguntas cortas (máx 60 caracteres) que el dueño podría hacerte a continuación, siempre dentro del scope del negocio.
- Si rechazaste la pregunta por estar fuera de scope, deja "preguntasSugeridas" como [].`;

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

  const { messages, metricas } = payload;
  if (!Array.isArray(messages) || messages.length === 0) {
    return json(400, { error: 'missing_messages' });
  }
  if (!metricas) return json(400, { error: 'missing_metricas' });

  try {
    const system = `${SCOPE_RULES}

Métricas actuales del negocio (úsalas como única fuente de verdad):
${JSON.stringify(metricas)}`;

    const resp = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      system,
      messages: messages.map((m) => ({
        role: m.role,
        content: String(m.content || '').slice(0, 2000),
      })),
    });

    const text = resp.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();

    let parsed;
    try {
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      parsed = JSON.parse(text.slice(start, end + 1));
    } catch {
      return json(200, { ok: true, reply: text, preguntasSugeridas: [] });
    }

    return json(200, {
      ok: true,
      reply: typeof parsed.reply === 'string' ? parsed.reply : '',
      preguntasSugeridas: Array.isArray(parsed.preguntasSugeridas)
        ? parsed.preguntasSugeridas.slice(0, 3)
        : [],
    });
  } catch (err) {
    console.error('[chat fn]', err);
    return json(500, { error: 'server_error', message: err.message });
  }
};
