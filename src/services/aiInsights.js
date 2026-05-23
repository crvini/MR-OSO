// =====================================================
// aiInsights.js — Chat con IA acotado al negocio
//   - Cache del análisis inicial en localStorage
//   - Demo mode: análisis canned + bloqueo de chat libre
//   - Solo envía métricas agregadas (nunca data cruda)
// =====================================================

import {
  transaccionesHoy,
  ingresosSemana,
  ultimosServicios,
  servicios,
  clientes,
} from '../data/mockData';
import {
  historico90Dias,
  agruparPorMes,
  promedioPorDiaSemana,
  impactoClima,
  topServicios as topServiciosHist,
  eventosNotables,
  topYBottomDias,
} from '../data/historicalData';

const CACHE_KEY = 'mroso_ai_initial_v3';
const DEMO_KEY = 'mroso_ai_demo_mode';

// ------- Demo mode -------
export const isDemoMode = () =>
  typeof window !== 'undefined' && localStorage.getItem(DEMO_KEY) === '1';

export const setDemoMode = (on) => {
  if (typeof window === 'undefined') return;
  if (on) localStorage.setItem(DEMO_KEY, '1');
  else localStorage.removeItem(DEMO_KEY);
};

// ------- Agregación: lo único que se envía al modelo -------
export function buildMetricas() {
  const totalSemana = ingresosSemana.reduce((a, d) => a + d.ingresos, 0);
  const promedioDiario = Math.round(totalSemana / ingresosSemana.length);

  const totalHoy = transaccionesHoy.reduce((a, t) => a + t.monto, 0);
  const metodoPagoHoy = transaccionesHoy.reduce((acc, t) => {
    acc[t.metodo] = (acc[t.metodo] || 0) + t.monto;
    return acc;
  }, {});

  const serviciosInactivos = servicios.filter((s) => !s.activo).map((s) => s.nombre);

  // ---- Histórico 90 días ----
  const ingresos90 = historico90Dias.reduce((a, d) => a + d.ingresos, 0);
  const vehiculos90 = historico90Dias.reduce((a, d) => a + d.vehiculos, 0);
  const porMes = agruparPorMes(historico90Dias);
  const porDow = promedioPorDiaSemana(historico90Dias);
  const climaImpacto = impactoClima(historico90Dias);
  const ranking = topYBottomDias(historico90Dias, 5);
  const eventos = eventosNotables(historico90Dias);
  const topServ90 = topServiciosHist(historico90Dias, 5);

  // Últimos 14 días detallados (para preguntas "qué pasó esta semana")
  const ultimos14 = historico90Dias.slice(-14).map((d) => ({
    fecha: d.fecha,
    dia: d.dia,
    ingresos: d.ingresos,
    vehiculos: d.vehiculos,
    clima: d.clima,
    nota: d.nota,
  }));

  // Tendencia mes a mes
  const tendencia = porMes.length >= 2
    ? porMes.map((m, i) => {
        const prev = porMes[i - 1];
        const pct = prev ? Math.round(((m.ingresos - prev.ingresos) / prev.ingresos) * 100) : null;
        return { mes: m.mes, ingresos: m.ingresos, vsMesAnterior: pct };
      })
    : porMes;

  return {
    moneda: 'Q',
    hoy: {
      fecha: '2026-05-23',
      totalIngresos: totalHoy,
      vehiculos: transaccionesHoy.length,
      ticketPromedio: Math.round(totalHoy / Math.max(1, transaccionesHoy.length)),
      metodoPago: metodoPagoHoy,
    },
    semanaActual: {
      ingresosPorDia: ingresosSemana,
      total: totalSemana,
      promedioDiario,
    },
    historico90Dias: {
      totalIngresos: ingresos90,
      totalVehiculos: vehiculos90,
      ticketPromedio: Math.round(ingresos90 / vehiculos90),
      promedioDiario: Math.round(ingresos90 / historico90Dias.length),
    },
    tendenciaMensual: tendencia,
    promedioPorDiaSemana: porDow,
    impactoClima: climaImpacto,
    topServiciosUltimos90: topServ90,
    mejoresDias90: ranking.mejores,
    peoresDias90: ranking.peores,
    eventosNotables: eventos,
    ultimos14Dias: ultimos14,
    catalogo: {
      totalServicios: servicios.length,
      activos: servicios.filter((s) => s.activo).length,
      inactivos: serviciosInactivos,
      precioMin: Math.min(...servicios.map((s) => s.precio)),
      precioMax: Math.max(...servicios.map((s) => s.precio)),
    },
    clientes: {
      total: clientes.length,
      vehiculosRegistrados: clientes.reduce((a, c) => a + c.vehiculos.length, 0),
      vipMasVisitas: Math.max(...clientes.map((c) => c.totalVisitas)),
    },
  };
}

// ------- Hash determinista (para cache de análisis inicial) -------
function hashMetricas(m) {
  const str = JSON.stringify(m);
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}
function writeCache(obj) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
  } catch {
    /* quota */
  }
}
export function clearCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    /* ignore */
  }
}

// ------- Respuestas demo (cero tokens) -------
const DEMO_INITIAL = {
  reply:
    'Análisis ejecutivo (últimos 3 meses):\n\n' +
    '• Marzo Q92k → Abril Q88k (-4%) → Mayo Q98k (+11%). Recuperación clara.\n' +
    '• Mejor día: 10 mayo (Día de la Madre) Q8,400 — máximo histórico.\n' +
    '• Peor día: 3 abril (Viernes Santo) Q0 — cierre planificado.\n' +
    '• Clima: días con lluvia caen 28% vs soleados. Tormenta -55%.\n' +
    '• Día más débil: miércoles, promedio Q2,300 vs Q5,150 del sábado.\n' +
    '• Servicio estrella: Lavado Completo (28% del volumen), seguido de Premium.\n' +
    '• Oportunidad: "Sábado VIP" (2x1 Premium) subió ese día +45%. Replicar.\n\n' +
    'Dime qué quieres profundizar.',
  preguntasSugeridas: [
    '¿Por qué cayó abril vs marzo?',
    '¿Cómo recupero los miércoles?',
    '¿Vale la pena cobrar más en sábados?',
  ],
};

const DEMO_GENERIC = {
  reply:
    'Estás en Modo Demo (0 tokens). Para hacer preguntas libres, desactiva el modo demo y asegúrate de tener tu Anthropic API key en .env.',
  preguntasSugeridas: [
    '¿Cómo subir el ticket promedio del sábado?',
    '¿Vale la pena reactivar Lavado de Motor?',
    '¿Qué promo lanzo para los miércoles?',
  ],
};

// ------- API pública -------

/**
 * Análisis inicial. Se llama al abrir el modal.
 * Cache por hash de métricas para no quemar tokens al reabrir.
 */
export async function getInitialAnalysis({ forceFresh = false } = {}) {
  const metricas = buildMetricas();

  if (isDemoMode()) {
    return { ...DEMO_INITIAL, source: 'demo' };
  }

  const key = hashMetricas(metricas);
  const cache = readCache();
  if (!forceFresh && cache[key]) {
    return { ...cache[key], source: 'cache' };
  }

  const data = await callChat({
    messages: [
      {
        role: 'user',
        content:
          'Dame un análisis ejecutivo de los últimos 3 meses (máx 8 líneas) con: tendencia mes a mes, mejor y peor día reciente con la causa, impacto del clima, servicio estrella y una oportunidad clara. Usa números concretos del histórico. Luego sugiéreme 3 preguntas para profundizar.',
      },
    ],
    metricas,
  });

  cache[key] = {
    reply: data.reply,
    preguntasSugeridas: data.preguntasSugeridas,
  };
  writeCache(cache);

  return { ...data, source: 'api' };
}

/**
 * Pregunta libre. Necesita API key (no funciona en demo mode).
 * @param {Array<{role: 'user'|'assistant', content: string}>} history
 *        Historial completo del chat para mantener contexto.
 */
export async function askQuestion(history) {
  const metricas = buildMetricas();

  if (isDemoMode()) {
    return { ...DEMO_GENERIC, source: 'demo' };
  }

  const data = await callChat({ messages: history, metricas });
  return { ...data, source: 'api' };
}

async function callChat({ messages, metricas }) {
  let r;
  try {
    r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, metricas }),
    });
  } catch (netErr) {
    const e = new Error(
      'No se pudo conectar al backend (puerto 3001). ¿Está corriendo `npm run dev:all`?',
    );
    e.code = 'network';
    throw e;
  }

  if (r.status === 404) {
    const e = new Error(
      'Endpoint /api/chat no existe. El backend está corriendo una versión vieja — reinicia `npm run dev:all`.',
    );
    e.code = 'stale_server';
    throw e;
  }

  if (!r.ok) {
    let err = {};
    try {
      err = await r.json();
    } catch {
      const text = await r.text().catch(() => '');
      err = { message: text || `HTTP ${r.status}` };
    }
    const e = new Error(err.message || `Error ${r.status} del servidor IA`);
    e.code = err.error || `http_${r.status}`;
    throw e;
  }

  const data = await r.json();
  return {
    reply: data.reply || '',
    preguntasSugeridas: data.preguntasSugeridas || [],
  };
}
