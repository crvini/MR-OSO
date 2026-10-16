// =====================================================
// chat-core.mjs — Lógica compartida del endpoint /api/chat
// La usan los tres runtimes: Express (local), Vercel y Netlify.
// Cambiar el prompt aquí lo cambia en todos lados.
// =====================================================

export const MODEL = 'claude-haiku-4-5-20251001';
export const MAX_TOKENS = 800;

const MAX_HISTORIAL = 10;   // turnos de conversación que se reenvían
const MAX_CHARS = 2000;     // tope por mensaje

export const SCOPE_RULES = `Eres un asesor de negocios para "Mr. Oso", un autolavado en Guatemala.

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

/**
 * Valida y normaliza el payload del cliente.
 * Devuelve { error, status } o { messages, metricas }.
 */
export function validarPayload(payload) {
  const { messages, metricas } = payload || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return { error: 'missing_messages', status: 400 };
  }
  if (!metricas || typeof metricas !== 'object') {
    return { error: 'missing_metricas', status: 400 };
  }

  const limpios = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant'))
    .slice(-MAX_HISTORIAL)
    .map((m) => ({ role: m.role, content: String(m.content || '').slice(0, MAX_CHARS) }))
    .filter((m) => m.content.length > 0);

  // La API de Anthropic exige que el primer mensaje sea del usuario:
  // al cortar el historial podemos quedar empezando en 'assistant'.
  while (limpios.length > 0 && limpios[0].role !== 'user') limpios.shift();

  if (limpios.length === 0) return { error: 'missing_messages', status: 400 };

  return { messages: limpios, metricas };
}

export function buildSystem(metricas) {
  return `${SCOPE_RULES}

Métricas actuales del negocio (úsalas como única fuente de verdad):
${JSON.stringify(metricas)}`;
}

/** Llama al modelo y normaliza la respuesta a { reply, preguntasSugeridas }. */
export async function runChat(client, { messages, metricas }) {
  const resp = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: buildSystem(metricas),
    messages,
  });

  const text = resp.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();

  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    const parsed = JSON.parse(text.slice(start, end + 1));
    return {
      reply: typeof parsed.reply === 'string' ? parsed.reply : text,
      preguntasSugeridas: Array.isArray(parsed.preguntasSugeridas)
        ? parsed.preguntasSugeridas.slice(0, 3)
        : [],
    };
  } catch {
    // El modelo no devolvió JSON — mandamos el texto tal cual.
    return { reply: text, preguntasSugeridas: [] };
  }
}

/**
 * Candado de origen. Si ALLOWED_ORIGINS no está configurado, no bloquea nada
 * (para que el primer deploy funcione). Configúralo para cerrar el endpoint.
 * Ejemplo: ALLOWED_ORIGINS=https://mr-oso.vercel.app,http://localhost:5173
 */
export function origenPermitido(origen) {
  const permitidos = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (permitidos.length === 0) return true;
  if (!origen) return false;
  return permitidos.some((p) => origen === p || origen.startsWith(`${p}/`));
}
