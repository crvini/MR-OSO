import { useState } from 'react';
import {
  Plus, Clock, User, X, Car, ChevronRight, ChevronLeft,
  RotateCcw, CheckCircle2, Bike, Truck,
} from 'lucide-react';
import { empleados, servicios } from '../data/mockData';
import { sucursales } from '../data/sucursales';
import { useDemoData } from '../context/useDemoData';

const ff = "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif";

const columnas = [
  { key: 'recibido',   label: 'Recibido',   dotColor: '#F59E0B' },
  { key: 'en_proceso', label: 'En Proceso', dotColor: '#dc2626' },
  { key: 'listo',      label: 'Listo',      dotColor: '#10B981' },
];

const TIPOS = [
  { key: 'Carro',  icon: Car },
  { key: 'Moto',   icon: Bike },
  { key: 'Camión', icon: Truck },
];

const empleadoColors = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'];
const colorEmpleado = (nombre) => {
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
  return empleadoColors[Math.abs(hash) % empleadoColors.length];
};

const inputStyle = {
  width: '100%', padding: '10px 14px', backgroundColor: '#111',
  border: '1px solid #3a3a3a', borderRadius: 8,
  color: '#fff', fontSize: 13, outline: 'none', fontFamily: ff,
};

const labelStyle = {
  display: 'block', fontSize: 13, fontWeight: 500, color: '#9ca3af', marginBottom: 6,
};

const VACIO = {
  placa: '', tipo: 'Carro', marca: '', modelo: '',
  cliente: '', telefono: '', servicioId: '', empleadoId: '', sucursal: 'centro',
};

export default function Turnos() {
  const { turnos, registrarTurno, avanzarTurno, retrocederTurno, reiniciarDemo } = useDemoData();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const set = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));

  const porEstado = (estado) => turnos.filter((t) => t.estado === estado);

  const guardar = () => {
    if (!form.placa.trim())   return setError('Falta la placa.');
    if (!form.servicioId)     return setError('Elige un servicio.');
    if (!form.empleadoId)     return setError('Asigna un empleado.');
    if (!form.cliente.trim()) return setError('Falta el nombre del cliente.');

    const servicio = servicios.find((s) => String(s.id) === form.servicioId);
    const empleado = empleados.find((e) => String(e.id) === form.empleadoId);

    const t = registrarTurno({
      ...form,
      servicio: servicio.nombre,
      precio: servicio.precio,
      empleado: empleado.nombre,
    });

    setError('');
    setModalOpen(false);
    setForm(VACIO);
    setExito(`${t.placa} registrado a las ${t.horaIngreso}. Ya está en "Recibido".`);
    setTimeout(() => setExito(''), 6000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: ff }} className="animate-fadeIn">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: '#fff', margin: 0, fontFamily: ff }}>
            Control de Turnos
          </h1>
          <p style={{ fontSize: 16, color: '#9ca3af', margin: '6px 0 0' }}>
            Registra el vehículo al entrar y muévelo conforme avanza.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={reiniciarDemo}
            title="Vuelve la demo a su estado original"
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px',
              backgroundColor: 'transparent', color: '#6b7280',
              border: '1px solid #3a3a3a', borderRadius: 10,
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: ff,
            }}
          >
            <RotateCcw size={15} /> Reiniciar demo
          </button>
          <button
            onClick={() => { setForm(VACIO); setError(''); setModalOpen(true); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
              backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: 10,
              fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: ff,
              boxShadow: '0 4px 15px rgba(220,38,38,0.3)',
            }}
          >
            <Plus size={16} /> Registrar Ingreso
          </button>
        </div>
      </div>

      {exito && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px',
          backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.4)',
          borderRadius: 10, color: '#6ee7b7', fontSize: 14,
        }}>
          <CheckCircle2 size={17} /> {exito}
        </div>
      )}

      {/* Kanban */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="kanban-grid">
        {columnas.map((col, colIdx) => {
          const items = porEstado(col.key);
          return (
            <div key={col.key} style={{
              backgroundColor: '#141414', borderRadius: 14, border: '1px solid #1e1e1e',
              display: 'flex', flexDirection: 'column', minHeight: 400,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 18px', borderBottom: '1px solid #1e1e1e',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: col.dotColor }} />
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{col.label}</span>
                </div>
                <span style={{
                  minWidth: 24, height: 24, borderRadius: 12, backgroundColor: '#2a2a2a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#9ca3af', padding: '0 7px',
                }}>
                  {items.length}
                </span>
              </div>

              <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                {items.map((turno) => (
                  <div key={turno.id} style={{
                    backgroundColor: '#1e1e1e', borderRadius: 12, padding: 16,
                    border: turno.nuevo ? '1px solid rgba(16,185,129,0.5)' : '1px solid #2a2a2a',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 8 }}>
                      <span style={{
                        fontSize: 13, fontWeight: 700, color: '#d1d5db', backgroundColor: '#111',
                        border: '1px solid #3a3a3a', padding: '4px 10px', borderRadius: 6,
                      }}>
                        {turno.placa}
                      </span>
                      {turno.nuevo && (
                        <span style={{
                          fontSize: 9.5, fontWeight: 700, color: '#10B981', letterSpacing: '0.06em',
                          backgroundColor: 'rgba(16,185,129,0.12)', padding: '3px 8px', borderRadius: 5,
                        }}>
                          NUEVO
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: '0 0 4px' }}>
                      {turno.servicio}
                    </p>
                    {turno.precio != null && (
                      <p style={{ fontSize: 13, color: '#10B981', fontWeight: 600, margin: '0 0 10px' }}>
                        Q {turno.precio.toFixed(2)}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <User size={13} style={{ color: '#6b7280' }} />
                      <span style={{ fontSize: 13, color: '#6b7280' }}>
                        {turno.empleado.split(' ').slice(0, 2).join(' ')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Clock size={13} style={{ color: '#6b7280' }} />
                        <span style={{ fontSize: 13, color: '#6b7280' }}>{turno.horaIngreso}</span>
                      </div>
                      <div style={{
                        width: 26, height: 26, borderRadius: '50%', backgroundColor: colorEmpleado(turno.empleado),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, color: '#fff',
                      }}>
                        {turno.empleado.charAt(0)}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div style={{ display: 'flex', gap: 6, borderTop: '1px solid #2a2a2a', paddingTop: 10 }}>
                      {colIdx > 0 && (
                        <button
                          onClick={() => retrocederTurno(turno.id)}
                          title="Regresar"
                          style={{
                            padding: '7px 9px', backgroundColor: 'transparent', border: '1px solid #3a3a3a',
                            borderRadius: 7, color: '#6b7280', cursor: 'pointer', display: 'flex',
                          }}
                        >
                          <ChevronLeft size={14} />
                        </button>
                      )}
                      {colIdx < 2 ? (
                        <button
                          onClick={() => avanzarTurno(turno.id)}
                          style={{
                            flex: 1, padding: '7px 10px', backgroundColor: 'rgba(220,38,38,0.1)',
                            border: '1px solid rgba(220,38,38,0.4)', borderRadius: 7,
                            color: '#fca5a5', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                            fontFamily: ff,
                          }}
                        >
                          {columnas[colIdx + 1].label} <ChevronRight size={13} />
                        </button>
                      ) : (
                        <span style={{
                          flex: 1, padding: '7px 10px', borderRadius: 7, textAlign: 'center',
                          backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                          color: '#6ee7b7', fontSize: 12, fontWeight: 700,
                        }}>
                          Cobrar en Caja →
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {items.length === 0 && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.25 }}>
                    <Car size={32} style={{ color: '#6b7280' }} />
                    <p style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>Sin vehículos</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-scaleIn"
            style={{
              backgroundColor: '#1e1e1e', borderRadius: 16, border: '1px solid #2e2e2e',
              width: '100%', maxWidth: 460, maxHeight: 'calc(100vh - 40px)',
              display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px', borderBottom: '1px solid #2e2e2e',
            }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>Registrar Ingreso</h2>
                <p style={{ fontSize: 12, color: '#6b7280', margin: '3px 0 0' }}>
                  La hora se toma automáticamente
                </p>
              </div>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#6b7280' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
              <div>
                <label style={labelStyle}>Placa *</label>
                <input autoFocus value={form.placa} onChange={set('placa')} placeholder="P-000-XXX" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Tipo de vehículo *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {TIPOS.map((t) => {
                    const activo = form.tipo === t.key;
                    return (
                      <button
                        key={t.key}
                        onClick={() => setForm((f) => ({ ...f, tipo: t.key }))}
                        style={{
                          flex: 1, padding: '10px 0', borderRadius: 8, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          fontSize: 12.5, fontWeight: activo ? 700 : 500, fontFamily: ff,
                          border: activo ? '1px solid #dc2626' : '1px solid #3a3a3a',
                          backgroundColor: activo ? 'rgba(220,38,38,0.12)' : 'transparent',
                          color: activo ? '#fca5a5' : '#9ca3af',
                        }}
                      >
                        <t.icon size={15} /> {t.key}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={labelStyle}>Marca</label>
                  <input value={form.marca} onChange={set('marca')} placeholder="Toyota" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Modelo</label>
                  <input value={form.modelo} onChange={set('modelo')} placeholder="Corolla" style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Servicio *</label>
                <select value={form.servicioId} onChange={set('servicioId')} style={inputStyle}>
                  <option value="">Seleccionar servicio...</option>
                  {servicios.filter((s) => s.activo).map((s) => (
                    <option key={s.id} value={s.id}>{s.nombre} — Q {s.precio.toFixed(2)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Empleado asignado *</label>
                <select value={form.empleadoId} onChange={set('empleadoId')} style={inputStyle}>
                  <option value="">Seleccionar empleado...</option>
                  {empleados.filter((e) => e.rol !== 'Cajera').map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre} — {e.rol}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Sucursal *</label>
                <select value={form.sucursal} onChange={set('sucursal')} style={inputStyle}>
                  {sucursales.map((s) => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 10 }}>
                <div>
                  <label style={labelStyle}>Cliente *</label>
                  <input value={form.cliente} onChange={set('cliente')} placeholder="Nombre completo" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Teléfono</label>
                  <input value={form.telefono} onChange={set('telefono')} placeholder="0000-0000" style={inputStyle} />
                </div>
              </div>

              {error && (
                <p style={{
                  margin: 0, fontSize: 13, color: '#fca5a5', padding: '10px 12px',
                  backgroundColor: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.4)', borderRadius: 8,
                }}>
                  {error}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, padding: '16px 24px', borderTop: '1px solid #2e2e2e' }}>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  flex: 1, padding: '11px 0', fontSize: 13, fontWeight: 600, color: '#9ca3af',
                  backgroundColor: '#111', border: '1px solid #3a3a3a', borderRadius: 8,
                  cursor: 'pointer', fontFamily: ff,
                }}
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                style={{
                  flex: 1, padding: '11px 0', fontSize: 13, fontWeight: 700, color: '#fff',
                  backgroundColor: '#dc2626', border: 'none', borderRadius: 8,
                  cursor: 'pointer', fontFamily: ff,
                }}
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .kanban-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
