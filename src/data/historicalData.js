// ==========================================
// Mr. Oso — Histórico simulado de 90 días
// Datos determinísticos con patrones realistas:
//   - Picos sábado/domingo, valle miércoles
//   - Impacto de lluvia / tormenta
//   - Eventos puntuales: promos, feriados, incidentes
// ==========================================

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const BASE_BY_DOW = { 0: 3400, 1: 2800, 2: 3100, 3: 2200, 4: 3650, 5: 4050, 6: 5150 };

const SERVICIOS_PROBS = [
  { nombre: 'Lavado Básico', p: 0.28, precio: 35 },
  { nombre: 'Lavado Completo', p: 0.30, precio: 65 },
  { nombre: 'Lavado Premium', p: 0.20, precio: 120 },
  { nombre: 'Encerado', p: 0.10, precio: 85 },
  { nombre: 'Detailing Interior', p: 0.06, precio: 200 },
  { nombre: 'Detailing Exterior', p: 0.04, precio: 180 },
  { nombre: 'Paquete VIP', p: 0.02, precio: 450 },
];

// Eventos puntuales para dar "color" al análisis
const EVENTOS = {
  '2026-03-02': { nota: 'Tubería rota — cerramos 4 horas', impacto: -0.65 },
  '2026-03-07': { nota: 'Promo "Sábado VIP" — 2x1 Premium', impacto: 0.45 },
  '2026-03-14': { nota: 'Día del Padre — alta demanda', impacto: 0.55 },
  '2026-03-18': { nota: 'Personal incompleto (2 lavadores ausentes)', impacto: -0.35 },
  '2026-03-25': { nota: 'Lanzamiento programa de fidelidad', impacto: 0.20 },
  '2026-03-30': { nota: 'Feriado Lunes Santo', impacto: -0.50 },
  '2026-04-02': { nota: 'Jueves Santo — cierre temprano', impacto: -0.45 },
  '2026-04-03': { nota: 'Viernes Santo — cerrado', impacto: -1.0 },
  '2026-04-12': { nota: 'Campaña Instagram — pico de nuevos clientes', impacto: 0.40 },
  '2026-04-18': { nota: 'Lluvia fuerte todo el día', impacto: -0.55 },
  '2026-04-25': { nota: 'Promo "Encerado + Premium" Q180', impacto: 0.35 },
  '2026-05-01': { nota: 'Día del Trabajo — cerrado', impacto: -1.0 },
  '2026-05-04': { nota: 'Compresor descompuesto — sin detailing', impacto: -0.30 },
  '2026-05-10': { nota: 'Día de la Madre — máximo histórico', impacto: 0.70 },
  '2026-05-15': { nota: 'Inicio temporada lluviosa', impacto: -0.15 },
  '2026-05-20': { nota: 'Lavado de Motor desactivado (revisión)', impacto: -0.10 },
};

// RNG determinístico (mismos datos en cada carga)
function makeRng(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pickClima(rng, mes) {
  const r = rng();
  const esLluvioso = mes >= 5 && mes <= 10; // mayo-octubre temporada lluviosa
  if (esLluvioso) {
    if (r < 0.35) return 'Soleado';
    if (r < 0.60) return 'Nublado';
    if (r < 0.88) return 'Lluvia';
    return 'Tormenta';
  }
  if (r < 0.60) return 'Soleado';
  if (r < 0.85) return 'Nublado';
  if (r < 0.96) return 'Lluvia';
  return 'Tormenta';
}

function generateDay(date, rng) {
  const dow = date.getDay();
  const mes = date.getMonth() + 1;
  const fecha = date.toISOString().slice(0, 10);
  const evento = EVENTOS[fecha];

  // Base con variación ±18%
  let ingresos = Math.round(BASE_BY_DOW[dow] * (0.82 + rng() * 0.36));

  // Clima
  const clima = pickClima(rng, mes);
  if (clima === 'Lluvia') ingresos = Math.round(ingresos * 0.72);
  if (clima === 'Tormenta') ingresos = Math.round(ingresos * 0.45);

  // Evento
  if (evento) ingresos = Math.max(0, Math.round(ingresos * (1 + evento.impacto)));

  const vehiculos = ingresos === 0 ? 0 : Math.max(1, Math.round(ingresos / 88));
  const ticketPromedio = vehiculos > 0 ? Math.round(ingresos / vehiculos) : 0;

  // Servicios del día (conteo aproximado)
  const desglose = {};
  let restante = vehiculos;
  for (const s of SERVICIOS_PROBS) {
    const n = Math.round(vehiculos * s.p * (0.8 + rng() * 0.4));
    if (n > 0 && restante > 0) {
      desglose[s.nombre] = Math.min(n, restante);
      restante -= desglose[s.nombre];
    }
  }
  if (restante > 0) {
    desglose['Lavado Completo'] = (desglose['Lavado Completo'] || 0) + restante;
  }

  // Método de pago (proporción)
  const propTarjeta = 0.4 + rng() * 0.25;
  const tarjeta = Math.round(ingresos * propTarjeta);
  const efectivo = ingresos - tarjeta;

  return {
    fecha,
    dia: DAYS[dow],
    ingresos,
    vehiculos,
    ticketPromedio,
    clima,
    nota: evento?.nota || null,
    servicios: desglose,
    pago: { tarjeta, efectivo },
  };
}

function generateHistorical(daysBack = 90, hoy = '2026-05-23') {
  const rng = makeRng(42);
  const out = [];
  const today = new Date(hoy + 'T12:00:00');

  for (let i = daysBack - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    out.push(generateDay(d, rng));
  }
  return out;
}

export const historico90Dias = generateHistorical(90);

// ----- Helpers de agregación -----

export function agruparPorMes(dias) {
  const map = {};
  for (const d of dias) {
    const mes = d.fecha.slice(0, 7); // YYYY-MM
    if (!map[mes]) {
      map[mes] = { mes, ingresos: 0, vehiculos: 0, diasOperados: 0 };
    }
    map[mes].ingresos += d.ingresos;
    map[mes].vehiculos += d.vehiculos;
    if (d.ingresos > 0) map[mes].diasOperados += 1;
  }
  return Object.values(map).map((m) => ({
    ...m,
    ticketPromedio: m.vehiculos > 0 ? Math.round(m.ingresos / m.vehiculos) : 0,
    promedioDiario: m.diasOperados > 0 ? Math.round(m.ingresos / m.diasOperados) : 0,
  }));
}

export function promedioPorDiaSemana(dias) {
  const acc = {};
  for (const d of dias) {
    if (!acc[d.dia]) acc[d.dia] = { ingresos: 0, n: 0 };
    acc[d.dia].ingresos += d.ingresos;
    acc[d.dia].n += 1;
  }
  return DAYS.filter((dia) => acc[dia]).map((dia) => ({
    dia,
    promedio: Math.round(acc[dia].ingresos / acc[dia].n),
    muestras: acc[dia].n,
  }));
}

export function impactoClima(dias) {
  const acc = {};
  for (const d of dias) {
    if (!acc[d.clima]) acc[d.clima] = { ingresos: 0, n: 0 };
    acc[d.clima].ingresos += d.ingresos;
    acc[d.clima].n += 1;
  }
  return Object.entries(acc).map(([clima, v]) => ({
    clima,
    promedio: Math.round(v.ingresos / v.n),
    dias: v.n,
  }));
}

export function topServicios(dias, n = 5) {
  const acc = {};
  for (const d of dias) {
    for (const [s, q] of Object.entries(d.servicios || {})) {
      acc[s] = (acc[s] || 0) + q;
    }
  }
  return Object.entries(acc)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }));
}

export function eventosNotables(dias) {
  return dias
    .filter((d) => d.nota)
    .map(({ fecha, dia, ingresos, nota }) => ({ fecha, dia, ingresos, nota }));
}

export function topYBottomDias(dias, n = 5) {
  const sorted = [...dias].sort((a, b) => b.ingresos - a.ingresos);
  return {
    mejores: sorted.slice(0, n).map(({ fecha, dia, ingresos, clima, nota }) => ({
      fecha, dia, ingresos, clima, nota,
    })),
    peores: sorted.slice(-n).reverse().map(({ fecha, dia, ingresos, clima, nota }) => ({
      fecha, dia, ingresos, clima, nota,
    })),
  };
}
