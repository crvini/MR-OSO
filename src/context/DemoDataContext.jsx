// ==========================================
// Store de la demo con persistencia en el navegador.
// NO es un backend: los datos viven en localStorage de este dispositivo.
// Sirve para que el flujo completo (registrar -> avanzar -> cobrar)
// se pueda recorrer de verdad durante una demostración.
// ==========================================
import { useEffect, useMemo, useState } from 'react';
import { DemoDataContext } from './demo-data-context';
import { turnosIniciales } from '../data/mockData';

const KEY = 'mroso_demo_v1';

const leer = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const ahora = () =>
  new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit', hour12: false });

export function DemoDataProvider({ children }) {
  const guardado = leer();

  const [turnos, setTurnos] = useState(guardado?.turnos ?? turnosIniciales);
  const [transacciones, setTransacciones] = useState(guardado?.transacciones ?? []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ turnos, transacciones }));
    } catch {
      /* cuota llena: la demo sigue funcionando en memoria */
    }
  }, [turnos, transacciones]);

  const registrarTurno = (datos) => {
    const turno = {
      id: Date.now(),
      placa: datos.placa.trim().toUpperCase(),
      tipo: datos.tipo,
      marca: datos.marca.trim(),
      modelo: datos.modelo.trim(),
      cliente: datos.cliente.trim(),
      telefono: datos.telefono?.trim() || '',
      servicio: datos.servicio,
      precio: datos.precio,
      empleado: datos.empleado,
      sucursal: datos.sucursal,
      horaIngreso: ahora(),
      estado: 'recibido',
      nuevo: true,
    };
    setTurnos((prev) => [turno, ...prev]);
    return turno;
  };

  const SIGUIENTE = { recibido: 'en_proceso', en_proceso: 'listo' };

  const avanzarTurno = (id) => {
    setTurnos((prev) =>
      prev.map((t) => {
        const siguiente = SIGUIENTE[t.estado];
        return t.id === id && siguiente ? { ...t, estado: siguiente } : t;
      }),
    );
  };

  const retrocederTurno = (id) => {
    const ANTERIOR = { en_proceso: 'recibido', listo: 'en_proceso' };
    setTurnos((prev) =>
      prev.map((t) => {
        const anterior = ANTERIOR[t.estado];
        return t.id === id && anterior ? { ...t, estado: anterior } : t;
      }),
    );
  };

  const cobrarTurno = (id, metodo, monto, descuento = 0) => {
    const turno = turnos.find((t) => t.id === id);
    if (!turno) return null;

    const transaccion = {
      id: Date.now(),
      turnoId: id,
      hora: ahora(),
      placa: turno.placa,
      tipo: turno.tipo || 'Carro',
      servicio: turno.servicio,
      cliente: turno.cliente,
      sucursal: turno.sucursal || 'centro',
      metodo,
      // El monto real cobrado, ya con descuento aplicado
      monto: monto ?? turno.precio ?? 0,
      descuento,
    };

    setTransacciones((prev) => [transaccion, ...prev]);
    setTurnos((prev) => prev.map((t) => (t.id === id ? { ...t, estado: 'entregado' } : t)));
    return transaccion;
  };

  const reiniciarDemo = () => {
    setTurnos(turnosIniciales);
    setTransacciones([]);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  };

  const capturadoHoy = useMemo(() => {
    const ingresos = transacciones.reduce((a, t) => a + t.monto, 0);
    return {
      ingresos,
      vehiculos: transacciones.length,
      ticketPromedio: transacciones.length
        ? Math.round(ingresos / transacciones.length)
        : 0,
    };
  }, [transacciones]);

  const valor = {
    turnos,
    transacciones,
    capturadoHoy,
    registrarTurno,
    avanzarTurno,
    retrocederTurno,
    cobrarTurno,
    reiniciarDemo,
  };

  return <DemoDataContext.Provider value={valor}>{children}</DemoDataContext.Provider>;
}
