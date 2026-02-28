import { useState } from 'react';
import {
  Car,
  Sparkles,
  Tag,
  Banknote,
  CreditCard,
  Landmark,
  Printer,
  CheckCircle2,
  Receipt,
  Plus,
  CircleDot,
} from 'lucide-react';

export default function Caja() {
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [descFrec, setDescFrec] = useState(true);
  const [descPromo, setDescPromo] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCierreConfirm, setShowCierreConfirm] = useState(false);

  const serviciosTicket = [
    { nombre: 'Lavado Premium', desc: 'Incluye tratamiento de llantas', cant: 1, precio: 120.00 },
    { nombre: 'Encerado', desc: 'Cera carnauba de alta calidad', cant: 1, precio: 85.00 },
    { nombre: 'Detailing Interior', desc: 'Limpieza profunda completa', cant: 1, precio: 200.00 },
  ];

  const subtotal = serviciosTicket.reduce((a, s) => a + s.precio * s.cant, 0);
  const descPct = descFrec ? 10 : 0;
  const descMonto = subtotal * (descPct / 100);
  const total = subtotal - descMonto;

  const metodos = [
    { key: 'efectivo', label: 'Efectivo', icon: Banknote },
    { key: 'tarjeta', label: 'Tarjeta Crédito/Débito', icon: CreditCard },
    { key: 'transferencia', label: 'Transferencia', icon: Landmark },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif" }} className="animate-fadeIn">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#ffffff', margin: 0, fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif" }}>
          Cobro y Caja
        </h1>
        <p style={{ fontSize: '16px', color: '#9ca3af', margin: '6px 0 0 0' }}>
          Registra cobros, aplica descuentos y gestiona el cierre de caja.
        </p>
      </div>

      {/* Main two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px' }} className="caja-grid">

        {/* ===== LEFT COLUMN ===== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Vehículo / Cliente */}
          <div style={{
            backgroundColor: '#1a1a1a', borderRadius: '14px',
            padding: '22px', border: '1px solid #2e2e2e',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Car size={18} style={{ color: '#dc2626' }} />
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Vehículo / Cliente</span>
              </div>
              <button
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  backgroundColor: 'transparent', border: '1px solid #3a3a3a',
                  borderRadius: '8px', padding: '6px 14px', cursor: 'pointer',
                  fontSize: '12px', fontWeight: 600, color: '#9ca3af',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.style.color = '#dc2626'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#3a3a3a'; e.currentTarget.style.color = '#9ca3af'; }}
              >
                <Plus size={14} />
                Cambiar Ticket
              </button>
            </div>

            <div style={{
              backgroundColor: '#111111', borderRadius: '10px',
              padding: '16px 18px', borderLeft: '3px solid #dc2626',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', letterSpacing: '0.05em', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                  Placas: P-245-KBR
                </p>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: '0 0 2px 0' }}>
                  Toyota Hilux Blanco
                </p>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                  Carlos Méndez
                </p>
              </div>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: 'rgba(16,185,129,0.15)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <CheckCircle2 size={18} style={{ color: '#10B981' }} />
              </div>
            </div>
          </div>

          {/* Servicios Realizados */}
          <div style={{
            backgroundColor: '#1a1a1a', borderRadius: '14px',
            padding: '22px', border: '1px solid #2e2e2e',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} style={{ color: '#dc2626' }} />
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Servicios Realizados</span>
              </div>
              <span style={{
                fontSize: '12px', fontWeight: 600, color: '#10B981',
                backgroundColor: 'rgba(16,185,129,0.12)', padding: '3px 10px',
                borderRadius: '20px',
              }}>
                3 Conceptos
              </span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['DESCRIPCIÓN', 'CANT.', 'PRECIO', 'SUBTOTAL'].map((h) => (
                    <th key={h} style={{
                      textAlign: h === 'DESCRIPCIÓN' ? 'left' : 'right',
                      padding: '10px 0', fontSize: '11px', fontWeight: 700,
                      color: '#6b7280', letterSpacing: '0.08em',
                      borderBottom: '1px solid #2e2e2e', whiteSpace: 'nowrap',
                      ...(h !== 'DESCRIPCIÓN' && { paddingLeft: '16px' }),
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {serviciosTicket.map((s, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #222222' }}>
                    <td style={{ padding: '14px 0' }}>
                      <p style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', margin: 0 }}>{s.nombre}</p>
                      <p style={{ fontSize: '13px', color: '#6b7280', margin: '2px 0 0 0' }}>{s.desc}</p>
                    </td>
                    <td style={{ padding: '14px 0 14px 16px', textAlign: 'right', fontSize: '15px', color: '#9ca3af' }}>{s.cant}</td>
                    <td style={{ padding: '14px 0 14px 16px', textAlign: 'right', fontSize: '15px', color: '#9ca3af' }}>Q {s.precio.toFixed(2)}</td>
                    <td style={{ padding: '14px 0 14px 16px', textAlign: 'right', fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>Q {(s.precio * s.cant).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Descuentos y Promociones */}
          <div style={{
            backgroundColor: '#1a1a1a', borderRadius: '14px',
            padding: '22px', border: '1px solid #2e2e2e',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Tag size={18} style={{ color: '#dc2626' }} />
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Descuentos y Promociones</span>
            </div>

            {/* Discount chips */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <button
                onClick={() => setDescFrec(!descFrec)}
                style={{
                  padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                  fontSize: '12px', fontWeight: 600, transition: 'all 0.2s',
                  border: descFrec ? '1px solid #dc2626' : '1px solid #3a3a3a',
                  backgroundColor: descFrec ? 'rgba(220,38,38,0.1)' : 'transparent',
                  color: descFrec ? '#dc2626' : '#9ca3af',
                }}
              >
                Cliente Frecuente (10%)
              </button>
              <button
                onClick={() => setDescPromo(!descPromo)}
                style={{
                  padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                  fontSize: '12px', fontWeight: 600, transition: 'all 0.2s',
                  border: descPromo ? '1px solid #dc2626' : '1px solid #3a3a3a',
                  backgroundColor: descPromo ? 'rgba(220,38,38,0.1)' : 'transparent',
                  color: descPromo ? '#dc2626' : '#9ca3af',
                }}
              >
                Promo Apertura (Q 50)
              </button>
            </div>

            {/* Coupon input */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Código de cupón..."
                style={{
                  flex: 1, padding: '10px 14px', backgroundColor: '#111111',
                  border: '1px solid #3a3a3a', borderRadius: '8px',
                  color: '#ffffff', fontSize: '13px', outline: 'none',
                }}
              />
              <button style={{
                padding: '10px 18px', backgroundColor: '#dc2626',
                color: '#ffffff', border: 'none', borderRadius: '8px',
                fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#b91c1c'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#dc2626'; }}
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Método de Pago */}
          <div style={{
            backgroundColor: '#1a1a1a', borderRadius: '14px',
            padding: '22px', border: '1px solid #2e2e2e',
          }}>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: '0 0 16px 0' }}>
              Método de Pago
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {metodos.map((m) => {
                const sel = metodoPago === m.key;
                return (
                  <button
                    key={m.key}
                    onClick={() => setMetodoPago(m.key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '14px 16px', borderRadius: '10px',
                      backgroundColor: sel ? 'rgba(220,38,38,0.06)' : '#111111',
                      border: sel ? '1px solid rgba(220,38,38,0.3)' : '1px solid #2a2a2a',
                      cursor: 'pointer', transition: 'all 0.2s', width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    <m.icon size={18} style={{ color: sel ? '#dc2626' : '#6b7280', flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: sel ? '#ffffff' : '#9ca3af' }}>
                      {m.label}
                    </span>
                    {/* Radio */}
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '50%',
                      border: sel ? '2px solid #dc2626' : '2px solid #4b5563',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {sel && (
                        <div style={{
                          width: '10px', height: '10px', borderRadius: '50%',
                          backgroundColor: '#dc2626',
                        }} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resumen de Cobro */}
          <div style={{
            backgroundColor: '#222222', borderRadius: '14px',
            padding: '22px', border: '1px solid #2e2e2e',
            display: 'flex', flexDirection: 'column', gap: '0',
          }}>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: '0 0 18px 0' }}>
              Resumen de Cobro
            </p>

            {/* Detail lines */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>Subtotal</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Q {subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>Descuento ({descPct}%)</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#dc2626' }}>-Q {descMonto.toFixed(2)}</span>
            </div>

            {/* Separator */}
            <div style={{ height: '1px', backgroundColor: '#3a3a3a', marginBottom: '18px' }} />

            {/* Total */}
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', letterSpacing: '0.08em', margin: '0 0 2px 0', textTransform: 'uppercase' }}>
                Total GTQ
              </p>
              <p style={{ fontSize: '36px', fontWeight: 800, color: '#dc2626', margin: 0, lineHeight: 1.1 }}>
                Q {total.toFixed(2)}
              </p>
            </div>

            {/* Finalize button */}
            <button
              onClick={() => setShowConfirm(true)}
              style={{
                width: '100%', padding: '14px 0',
                backgroundColor: '#dc2626', color: '#ffffff',
                border: 'none', borderRadius: '10px',
                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 15px rgba(220,38,38,0.3)',
                transition: 'all 0.2s', letterSpacing: '0.03em',
                textTransform: 'uppercase',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#b91c1c'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#dc2626'; }}
            >
              <Printer size={16} />
              Finalizar y Generar Ticket
            </button>

            {/* Cancel */}
            <button
              style={{
                width: '100%', padding: '10px 0', marginTop: '10px',
                backgroundColor: 'transparent', color: '#6b7280',
                border: '1px solid #3a3a3a', borderRadius: '10px',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.borderColor = '#6b7280'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.borderColor = '#3a3a3a'; }}
            >
              Cancelar Operación
            </button>
          </div>
        </div>
      </div>

      {/* ===== RESUMEN DE HOY (full width) ===== */}
      <div style={{
        backgroundColor: '#1a1a1a', borderRadius: '14px',
        padding: '20px 24px', border: '1px solid #2e2e2e',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Receipt size={18} style={{ color: '#dc2626' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>Resumen de Hoy</span>
          </div>
          <span style={{
            fontSize: '11px', fontWeight: 700, color: '#10B981',
            backgroundColor: 'rgba(16,185,129,0.12)', padding: '3px 10px',
            borderRadius: '20px', letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            Abierta
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {/* Stats */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 2px 0', fontWeight: 600 }}>Ventas (28)</p>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Q 3,450.00</p>
          </div>
          <div style={{ width: '1px', height: '30px', backgroundColor: '#3a3a3a' }} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 2px 0', fontWeight: 600 }}>Efectivo</p>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Q 2,100.00</p>
          </div>
          <div style={{ width: '1px', height: '30px', backgroundColor: '#3a3a3a' }} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 2px 0', fontWeight: 600 }}>Tarjeta/Transf.</p>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Q 1,350.00</p>
          </div>

          {/* Corte de caja button */}
          <button
            onClick={() => setShowCierreConfirm(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 18px', borderRadius: '8px',
              backgroundColor: 'transparent', border: '1px solid #dc2626',
              color: '#dc2626', fontSize: '12px', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.2s',
              letterSpacing: '0.03em', textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            Corte de Caja
          </button>
        </div>
      </div>

      {/* ===== MODALS ===== */}

      {/* Confirm Cobro */}
      {showConfirm && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => setShowConfirm(false)}
        >
          <div
            style={{ backgroundColor: '#1e1e1e', borderRadius: '16px', border: '1px solid #2e2e2e', width: '100%', maxWidth: '360px', padding: '32px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
            className="animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <CheckCircle2 size={30} style={{ color: '#10B981' }} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '0 0 8px 0' }}>Cobro Exitoso!</h3>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>Vehículo: P-245-KBR</p>
            <p style={{ fontSize: '28px', fontWeight: 800, color: '#dc2626', margin: '0 0 4px 0' }}>Q {total.toFixed(2)}</p>
            <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 24px 0' }}>
              Pago con {metodoPago === 'efectivo' ? 'efectivo' : metodoPago === 'tarjeta' ? 'tarjeta' : 'transferencia'}
            </p>
            <button
              onClick={() => setShowConfirm(false)}
              style={{
                width: '100%', padding: '12px 0', backgroundColor: '#dc2626',
                color: '#ffffff', border: 'none', borderRadius: '10px',
                fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#b91c1c'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#dc2626'; }}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {/* Confirm Cierre */}
      {showCierreConfirm && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => setShowCierreConfirm(false)}
        >
          <div
            style={{ backgroundColor: '#1e1e1e', borderRadius: '16px', border: '1px solid #2e2e2e', width: '100%', maxWidth: '360px', padding: '32px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
            className="animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(220,38,38,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <Receipt size={30} style={{ color: '#dc2626' }} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '0 0 8px 0' }}>Cierre de Caja</h3>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>
              Total del día: <span style={{ fontWeight: 700, color: '#ffffff' }}>Q 3,450.00</span>
            </p>
            <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 24px 0' }}>28 transacciones registradas</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowCierreConfirm(false)}
                style={{
                  flex: 1, padding: '12px 0', fontSize: '13px', fontWeight: 600,
                  color: '#9ca3af', backgroundColor: '#111111', border: '1px solid #3a3a3a',
                  borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; }}
              >
                Cancelar
              </button>
              <button
                onClick={() => { setShowCierreConfirm(false); alert('Caja cerrada exitosamente (Demo)'); }}
                style={{
                  flex: 1, padding: '12px 0', fontSize: '13px', fontWeight: 700,
                  color: '#ffffff', backgroundColor: '#dc2626', border: 'none',
                  borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#b91c1c'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#dc2626'; }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsive */}
      <style>{`
        @media (max-width: 1024px) {
          .caja-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
