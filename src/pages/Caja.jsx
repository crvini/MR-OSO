import { useState } from 'react';
import {
  Car, Tag, Banknote, CreditCard, Landmark, Printer,
  CheckCircle2, Receipt, Inbox, Bike, Truck,
} from 'lucide-react';
import { sucursales } from '../data/sucursales';
import { useDemoData } from '../context/useDemoData';

const ff = "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif";

const card = {
  backgroundColor: '#1a1a1a', borderRadius: 14,
  border: '1px solid #2e2e2e', padding: 24,
};

const metodos = [
  { key: 'Efectivo', label: 'Efectivo', icon: Banknote },
  { key: 'Tarjeta', label: 'Tarjeta Crédito/Débito', icon: CreditCard },
  { key: 'Transferencia', label: 'Transferencia', icon: Landmark },
];

const iconoTipo = { Carro: Car, Moto: Bike, 'Camión': Truck };
const nombreSucursal = (id) => sucursales.find((s) => s.id === id)?.nombre || 'Centro';

export default function Caja() {
  const { turnos, transacciones, capturadoHoy, cobrarTurno } = useDemoData();
  const [seleccionado, setSeleccionado] = useState(null);
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [descFrec, setDescFrec] = useState(false);
  const [recibo, setRecibo] = useState(null);

  const porCobrar = turnos.filter((t) => t.estado === 'listo');
  const turno = porCobrar.find((t) => t.id === seleccionado) || null;

  const subtotal = turno?.precio ?? 0;
  const descPct = descFrec ? 10 : 0;
  const descMonto = subtotal * (descPct / 100);
  const total = subtotal - descMonto;

  const cobrar = () => {
    if (!turno) return;
    const t = cobrarTurno(turno.id, metodoPago, total, descMonto);
    setRecibo(t);
    setSeleccionado(null);
    setDescFrec(false);
    setTimeout(() => setRecibo(null), 8000);
  };

  const porMetodo = transacciones.reduce((acc, t) => {
    acc[t.metodo] = (acc[t.metodo] || 0) + t.monto;
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: ff }} className="animate-fadeIn">

      <div>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#fff', margin: 0, fontFamily: ff }}>
          Cobro y Caja
        </h1>
        <p style={{ fontSize: 16, color: '#9ca3af', margin: '6px 0 0' }}>
          Cobra los vehículos que ya están listos. El cobro cierra el turno.
        </p>
      </div>

      {recibo && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px',
          backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.4)',
          borderRadius: 10, color: '#6ee7b7', fontSize: 14,
        }}>
          <CheckCircle2 size={17} />
          Cobrado {recibo.placa} — Q {recibo.monto.toFixed(2)} en {recibo.metodo} a las {recibo.hora}.
          Ya aparece en el resumen de abajo.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 16 }} className="caja-grid">

        {/* Cola por cobrar */}
        <div style={card}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0, fontFamily: ff }}>
            Listos para Cobrar
          </h2>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 18px' }}>
            {porCobrar.length === 0
              ? 'Ninguno por ahora'
              : `${porCobrar.length} vehículo${porCobrar.length > 1 ? 's' : ''} esperando`}
          </p>

          {porCobrar.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '40px 0', opacity: 0.35, textAlign: 'center',
            }}>
              <Inbox size={34} color="#6b7280" />
              <p style={{ fontSize: 13, color: '#6b7280', margin: '10px 0 0', maxWidth: 220, lineHeight: 1.5 }}>
                Mueve un vehículo hasta <strong>Listo</strong> en Turnos y aparecerá aquí.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {porCobrar.map((t) => {
                const activo = seleccionado === t.id;
                const Icono = iconoTipo[t.tipo] || Car;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSeleccionado(t.id)}
                    style={{
                      textAlign: 'left', padding: '14px 16px', borderRadius: 10, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 12, fontFamily: ff,
                      border: activo ? '1px solid #dc2626' : '1px solid #2a2a2a',
                      backgroundColor: activo ? 'rgba(220,38,38,0.08)' : '#111',
                      transition: 'all 0.15s',
                    }}
                  >
                    <Icono size={18} color={activo ? '#dc2626' : '#6b7280'} style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>{t.placa}</p>
                      <p style={{ fontSize: 12.5, color: '#9ca3af', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.servicio}
                      </p>
                      <p style={{ fontSize: 11.5, color: '#4b5563', margin: '2px 0 0' }}>
                        {t.cliente} · {nombreSucursal(t.sucursal)}
                      </p>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#10B981', whiteSpace: 'nowrap' }}>
                      Q {(t.precio ?? 0).toFixed(2)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Ticket */}
        <div style={card}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0, fontFamily: ff }}>
            Ticket
          </h2>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 18px' }}>
            {turno ? `${turno.placa} · ${turno.cliente}` : 'Elige un vehículo de la izquierda'}
          </p>

          {!turno ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '60px 0', opacity: 0.3,
            }}>
              <Receipt size={38} color="#6b7280" />
              <p style={{ fontSize: 13, color: '#6b7280', margin: '10px 0 0' }}>Sin vehículo seleccionado</p>
            </div>
          ) : (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', backgroundColor: '#111', borderRadius: 10,
                border: '1px solid #2a2a2a', marginBottom: 16,
              }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: 0 }}>{turno.servicio}</p>
                  <p style={{ fontSize: 12.5, color: '#6b7280', margin: '2px 0 0' }}>
                    {turno.tipo} · ingresó {turno.horaIngreso} · {turno.empleado.split(' ')[0]}
                  </p>
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Q {subtotal.toFixed(2)}</span>
              </div>

              <button
                onClick={() => setDescFrec(!descFrec)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '11px 14px', borderRadius: 9, cursor: 'pointer', marginBottom: 16,
                  fontSize: 13, fontWeight: 600, fontFamily: ff,
                  border: descFrec ? '1px solid #dc2626' : '1px solid #3a3a3a',
                  backgroundColor: descFrec ? 'rgba(220,38,38,0.1)' : 'transparent',
                  color: descFrec ? '#dc2626' : '#9ca3af',
                }}
              >
                <Tag size={15} /> Descuento cliente frecuente (10%)
              </button>

              <p style={{
                fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.08em',
                textTransform: 'uppercase', margin: '0 0 10px',
              }}>
                Forma de pago
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                {metodos.map((m) => {
                  const activo = metodoPago === m.key;
                  return (
                    <button
                      key={m.key}
                      onClick={() => setMetodoPago(m.key)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
                        borderRadius: 9, cursor: 'pointer', fontSize: 13.5, fontFamily: ff,
                        fontWeight: activo ? 700 : 500, textAlign: 'left',
                        border: activo ? '1px solid #dc2626' : '1px solid #3a3a3a',
                        backgroundColor: activo ? 'rgba(220,38,38,0.08)' : 'transparent',
                        color: activo ? '#fff' : '#9ca3af',
                      }}
                    >
                      <m.icon size={16} color={activo ? '#dc2626' : '#6b7280'} />
                      {m.label}
                    </button>
                  );
                })}
              </div>

              <div style={{ borderTop: '1px solid #2e2e2e', paddingTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                  <span style={{ fontSize: 14, color: '#9ca3af' }}>Subtotal</span>
                  <span style={{ fontSize: 14, color: '#fff' }}>Q {subtotal.toFixed(2)}</span>
                </div>
                {descFrec && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                    <span style={{ fontSize: 14, color: '#9ca3af' }}>Descuento ({descPct}%)</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#dc2626' }}>-Q {descMonto.toFixed(2)}</span>
                  </div>
                )}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginTop: 12, paddingTop: 12, borderTop: '1px solid #2e2e2e',
                }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Total</span>
                  <span style={{ fontSize: 26, fontWeight: 700, color: '#10B981', fontFamily: ff }}>
                    Q {total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                <button
                  onClick={() => setSeleccionado(null)}
                  style={{
                    padding: '12px 18px', fontSize: 13, fontWeight: 600, color: '#9ca3af',
                    backgroundColor: 'transparent', border: '1px solid #3a3a3a',
                    borderRadius: 10, cursor: 'pointer', fontFamily: ff,
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={cobrar}
                  style={{
                    flex: 1, padding: '12px 0', fontSize: 14, fontWeight: 700, color: '#fff',
                    backgroundColor: '#dc2626', border: 'none', borderRadius: 10,
                    cursor: 'pointer', fontFamily: ff, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: '0 4px 15px rgba(220,38,38,0.3)',
                  }}
                >
                  <Printer size={16} /> Cobrar Q {total.toFixed(2)}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Resumen del día */}
      <div style={{ ...card, padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: transacciones.length ? 18 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Receipt size={18} color="#dc2626" />
            <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Cobrado en esta sesión</span>
            <span style={{
              fontSize: 11, fontWeight: 700, color: '#10B981', letterSpacing: '0.05em',
              backgroundColor: 'rgba(16,185,129,0.12)', padding: '3px 10px', borderRadius: 20,
              textTransform: 'uppercase',
            }}>
              Abierta
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            {[
              { l: `Ventas (${capturadoHoy.vehiculos})`, v: `Q ${capturadoHoy.ingresos.toFixed(2)}` },
              { l: 'Efectivo', v: `Q ${(porMetodo.Efectivo || 0).toFixed(2)}` },
              { l: 'Tarjeta', v: `Q ${(porMetodo.Tarjeta || 0).toFixed(2)}` },
              { l: 'Transferencia', v: `Q ${(porMetodo.Transferencia || 0).toFixed(2)}` },
            ].map((s) => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: '#6b7280', margin: '0 0 2px', fontWeight: 600 }}>{s.l}</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>{s.v}</p>
              </div>
            ))}
          </div>
        </div>

        {transacciones.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['HORA', 'PLACA', 'SERVICIO', 'SUCURSAL', 'MÉTODO', 'MONTO'].map((h) => (
                    <th key={h} style={{
                      textAlign: h === 'MONTO' ? 'right' : 'left', padding: '10px 14px',
                      fontSize: 11, fontWeight: 700, color: '#6b7280',
                      letterSpacing: '0.08em', borderBottom: '1px solid #2e2e2e', whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transacciones.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #1e1e1e' }}>
                    <td style={{ padding: '12px 14px', fontSize: 14, color: '#9ca3af' }}>{t.hora}</td>
                    <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 600, color: '#fff' }}>{t.placa}</td>
                    <td style={{ padding: '12px 14px', fontSize: 14, color: '#9ca3af' }}>{t.servicio}</td>
                    <td style={{ padding: '12px 14px', fontSize: 14, color: '#9ca3af' }}>{nombreSucursal(t.sucursal)}</td>
                    <td style={{ padding: '12px 14px', fontSize: 14, color: '#9ca3af' }}>{t.metodo}</td>
                    <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 700, color: '#10B981', textAlign: 'right' }}>
                      Q {t.monto.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .caja-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
