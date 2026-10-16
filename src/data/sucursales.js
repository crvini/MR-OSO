// ==========================================
// Mr Oso — Datos mock por sucursal
// Determinístico: mismos números en cada carga.
// Patrones realistas: pico sábado por la mañana, valle miércoles,
// bajón de almuerzo 13:00-14:00 (clave para mover descansos).
// ==========================================

export const sucursales = [
  { id: 'centro',    nombre: 'Centro',       zona: 'Zona 1',  escala: 1.00, ticket: 97 },
  { id: 'roosevelt', nombre: 'Roosevelt',    zona: 'Zona 7',  escala: 1.28, ticket: 92 },
  { id: 'zona10',    nombre: 'Zona 10',      zona: 'Zona 10', escala: 0.86, ticket: 134 },
  { id: 'villanueva',nombre: 'Villa Nueva',  zona: 'Villa Nueva', escala: 1.12, ticket: 81 },
  { id: 'mixco',     nombre: 'Mixco',        zona: 'Mixco',   escala: 0.64, ticket: 88 },
];

export const HORAS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
export const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
export const DIA_HOY = 'Vie';

// Qué tanto mueve cada día
const FACTOR_DIA = { Lun: 0.72, Mar: 0.80, Mié: 0.56, Jue: 0.94, Vie: 1.05, Sáb: 1.35, Dom: 0.88 };

// Curva del día: arranque lento, pico media mañana, bajón de almuerzo, repunte de tarde
const CURVA_HORA = {
  7: 0.35, 8: 0.70, 9: 1.00, 10: 1.15, 11: 1.05, 12: 0.75,
  13: 0.45, 14: 0.50, 15: 0.80, 16: 0.95, 17: 0.85, 18: 0.45,
};

const TIPOS = [
  { tipo: 'Carros',   p: 0.68 },
  { tipo: 'Motos',    p: 0.21 },
  { tipo: 'Camiones', p: 0.11 },
];

// RNG determinístico
function makeRng(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generar() {
  const out = {};

  sucursales.forEach((suc, idx) => {
    const rng = makeRng(1000 + idx * 137);
    const celdas = {};

    DIAS.forEach((dia) => {
      celdas[dia] = {};
      HORAS.forEach((hora) => {
        const base = 6.2 * suc.escala * FACTOR_DIA[dia] * CURVA_HORA[hora];
        const jitter = 0.85 + rng() * 0.3;
        celdas[dia][hora] = Math.max(0, Math.round(base * jitter));
      });
    });

    out[suc.id] = { celdas, ticket: suc.ticket };
  });

  return out;
}

const DATA = generar();

// ---------- Helpers de lectura ----------

const idsDe = (sucursalId) =>
  sucursalId === 'todas' ? sucursales.map((s) => s.id) : [sucursalId];

/** Matriz día x hora de vehículos atendidos. */
export function heatmap(sucursalId = 'todas') {
  const ids = idsDe(sucursalId);
  const celdas = {};
  let max = 0;
  let min = Infinity;
  let celdaMin = null;
  let celdaMax = null;

  DIAS.forEach((dia) => {
    celdas[dia] = {};
    HORAS.forEach((hora) => {
      const v = ids.reduce((a, id) => a + DATA[id].celdas[dia][hora], 0);
      celdas[dia][hora] = v;
      if (v > max) { max = v; celdaMax = { dia, hora, v }; }
      // El minimo solo cuenta en horario pleno: apertura y cierre siempre son
      // bajos y no sirven para decidir descansos.
      if (hora >= 8 && hora <= 17 && v < min) { min = v; celdaMin = { dia, hora, v }; }
    });
  });

  return { celdas, max, min, celdaMin, celdaMax };
}

/** Ingresos por día de la semana. */
export function ingresosSemana(sucursalId = 'todas') {
  const ids = idsDe(sucursalId);
  return DIAS.map((dia) => {
    const ingresos = ids.reduce((acc, id) => {
      const vehiculos = HORAS.reduce((a, h) => a + DATA[id].celdas[dia][h], 0);
      return acc + vehiculos * DATA[id].ticket;
    }, 0);
    return { dia, ingresos };
  });
}

/** Resumen del día de hoy. */
export function resumen(sucursalId = 'todas') {
  const ids = idsDe(sucursalId);
  const porHora = HORAS.map((hora) => ({
    hora,
    vehiculos: ids.reduce((a, id) => a + DATA[id].celdas[DIA_HOY][hora], 0),
  }));

  const vehiculos = porHora.reduce((a, h) => a + h.vehiculos, 0);
  const ingresos = ids.reduce((acc, id) => {
    const v = HORAS.reduce((a, h) => a + DATA[id].celdas[DIA_HOY][h], 0);
    return acc + v * DATA[id].ticket;
  }, 0);

  const pico = porHora.reduce((a, b) => (b.vehiculos > a.vehiculos ? b : a), porHora[0]);

  // El valle se calcula sobre horario pleno (8-17): la primera y la última hora
  // siempre son bajas por apertura/cierre y no sirven para mover descansos.
  const pleno = porHora.filter((h) => h.hora >= 8 && h.hora <= 17);
  const valle = pleno.reduce((a, b) => (b.vehiculos < a.vehiculos ? b : a), pleno[0]);

  return {
    ingresos,
    vehiculos,
    ticketPromedio: vehiculos > 0 ? Math.round(ingresos / vehiculos) : 0,
    horaPico: `${pico.hora}:00`,
    horaValle: `${valle.hora}:00`,
  };
}

/** Ranking de sucursales por ingresos de la semana. */
export function ranking() {
  return sucursales
    .map((s) => {
      const ingresos = ingresosSemana(s.id).reduce((a, d) => a + d.ingresos, 0);
      return { id: s.id, nombre: s.nombre, zona: s.zona, ingresos };
    })
    .sort((a, b) => b.ingresos - a.ingresos);
}

/** Desglose por tipo de vehículo. */
export function tiposVehiculo(sucursalId = 'todas') {
  const { vehiculos } = resumen(sucursalId);
  let restante = vehiculos;

  return TIPOS.map((t, i) => {
    const cantidad = i === TIPOS.length - 1 ? restante : Math.round(vehiculos * t.p);
    restante -= cantidad;
    return {
      tipo: t.tipo,
      cantidad,
      pct: vehiculos > 0 ? Math.round((cantidad / vehiculos) * 100) : 0,
    };
  });
}
