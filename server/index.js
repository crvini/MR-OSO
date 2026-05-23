import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '300kb' }));

const PORT = process.env.PORT || 3001;
const HAS_KEY = Boolean(process.env.ANTHROPIC_API_KEY);

const client = HAS_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, hasKey: HAS_KEY });
});

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

app.post('/api/chat', async (req, res) => {
  try {
    if (!client) {
      return res.status(503).json({
        error: 'no_api_key',
        message: 'Falta ANTHROPIC_API_KEY en .env',
      });
    }

    const { messages, metricas } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'missing_messages' });
    }
    if (!metricas) {
      return res.status(400).json({ error: 'missing_metricas' });
    }

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

    let json;
    try {
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      json = JSON.parse(text.slice(start, end + 1));
    } catch {
      return res.json({
        ok: true,
        reply: text,
        preguntasSugeridas: [],
      });
    }

    res.json({
      ok: true,
      reply: typeof json.reply === 'string' ? json.reply : '',
      preguntasSugeridas: Array.isArray(json.preguntasSugeridas)
        ? json.preguntasSugeridas.slice(0, 3)
        : [],
    });
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
