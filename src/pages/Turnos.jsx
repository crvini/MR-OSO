import { useState } from 'react';
import {
  Plus,
  Clock,
  User,
  X,
  Car,
  Search,
  Bell,
  MoreVertical,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { turnosIniciales, empleados, servicios } from '../data/mockData';

const columnas = [
  { key: 'recibido', label: 'Recibido', dotColor: '#F59E0B' },
  { key: 'en_proceso', label: 'En Proceso', dotColor: '#dc2626' },
  { key: 'listo', label: 'Listo', dotColor: '#10B981' },
];

export default function Turnos() {
  const [turnos] = useState(turnosIniciales);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();

  const turnosPorEstado = (estado) => turnos.filter((t) => t.estado === estado);

  // Employee initials color map for avatars
  const empleadoColors = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'];
  const getEmpleadoColor = (nombre) => {
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
    return empleadoColors[Math.abs(hash) % empleadoColors.length];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif" }} className="animate-fadeIn">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#ffffff', margin: 0, fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif" }}>
          Control de Turnos
        </h1>
        <p style={{ fontSize: '16px', color: '#9ca3af', margin: '6px 0 0 0' }}>
          Gestiona el flujo de vehículos en tiempo real.
        </p>
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }} className="kanban-grid">
        {columnas.map((col) => {
          const items = turnosPorEstado(col.key);
          return (
            <div
              key={col.key}
              style={{
                backgroundColor: '#141414',
                borderRadius: '14px',
                border: '1px solid #1e1e1e',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '400px',
              }}
            >
              {/* Column Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 18px',
                borderBottom: '1px solid #1e1e1e',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    backgroundColor: col.dotColor, display: 'inline-block',
                  }} />
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>
                    {col.label}
                  </span>
                </div>
                <span style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  backgroundColor: '#2a2a2a', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '11px', fontWeight: 700,
                  color: '#9ca3af',
                }}>
                  {items.length}
                </span>
              </div>

              {/* Cards */}
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                {items.map((turno) => {
                  const empColor = getEmpleadoColor(turno.empleado);
                  const empInitial = turno.empleado.charAt(0);
                  return (
                    <div
                      key={turno.id}
                      style={{
                        backgroundColor: '#1e1e1e',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #2a2a2a',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        cursor: 'default',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#3a3a3a';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#2a2a2a';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Top row: plate + menu */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{
                          fontSize: '13px', fontWeight: 700, color: '#d1d5db',
                          backgroundColor: '#111111', border: '1px solid #3a3a3a',
                          padding: '4px 10px', borderRadius: '6px', letterSpacing: '0.03em',
                        }}>
                          {turno.placa}
                        </span>
                        <button style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          padding: '2px', color: '#6b7280', display: 'flex',
                        }}>
                          <MoreVertical size={16} />
                        </button>
                      </div>

                      {/* Service name */}
                      <p style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', margin: '0 0 10px 0' }}>
                        {turno.servicio}
                      </p>

                      {/* Assigned employee */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                        <User size={13} style={{ color: '#6b7280' }} />
                        <span style={{ fontSize: '13px', color: '#6b7280' }}>
                          Asignado: {turno.empleado.split(' ').slice(0, 2).join(' ')}
                        </span>
                      </div>

                      {/* Bottom: time + avatar */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Clock size={13} style={{ color: '#6b7280' }} />
                          <span style={{ fontSize: '13px', color: '#6b7280' }}>{turno.horaIngreso}</span>
                        </div>
                        <div style={{
                          width: '26px', height: '26px', borderRadius: '50%',
                          backgroundColor: empColor, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#ffffff',
                        }}>
                          {empInitial}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {items.length === 0 && (
                  <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', opacity: 0.25,
                  }}>
                    <Car size={32} style={{ color: '#6b7280' }} />
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>Sin vehículos</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating + New Service Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#dc2626', color: '#ffffff',
            padding: '10px 20px', borderRadius: '10px',
            border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: 700,
            boxShadow: '0 4px 15px rgba(220,38,38,0.3)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#b91c1c'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#dc2626'; }}
        >
          <Plus size={16} />
          Nuevo Servicio
        </button>
      </div>

      {/* Modal Nuevo Vehiculo */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#1e1e1e', borderRadius: '16px',
              border: '1px solid #2e2e2e', width: '100%', maxWidth: '420px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            }}
            className="animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px', borderBottom: '1px solid #2e2e2e',
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Nuevo Vehículo</h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6b7280' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#9ca3af', marginBottom: '6px' }}>Placa del Vehículo</label>
                <input
                  type="text"
                  placeholder="P-000-XXX"
                  style={{
                    width: '100%', padding: '10px 14px', backgroundColor: '#111111',
                    border: '1px solid #3a3a3a', borderRadius: '8px',
                    color: '#ffffff', fontSize: '13px', outline: 'none',
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#9ca3af', marginBottom: '6px' }}>Marca</label>
                  <input
                    type="text"
                    placeholder="Toyota"
                    style={{
                      width: '100%', padding: '10px 14px', backgroundColor: '#111111',
                      border: '1px solid #3a3a3a', borderRadius: '8px',
                      color: '#ffffff', fontSize: '13px', outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#9ca3af', marginBottom: '6px' }}>Modelo</label>
                  <input
                    type="text"
                    placeholder="Corolla"
                    style={{
                      width: '100%', padding: '10px 14px', backgroundColor: '#111111',
                      border: '1px solid #3a3a3a', borderRadius: '8px',
                      color: '#ffffff', fontSize: '13px', outline: 'none',
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#9ca3af', marginBottom: '6px' }}>Servicio</label>
                <select
                  style={{
                    width: '100%', padding: '10px 14px', backgroundColor: '#111111',
                    border: '1px solid #3a3a3a', borderRadius: '8px',
                    color: '#ffffff', fontSize: '13px', outline: 'none',
                  }}
                >
                  <option value="">Seleccionar servicio...</option>
                  {servicios.filter((s) => s.activo).map((s) => (
                    <option key={s.id} value={s.id}>{s.nombre} — Q {s.precio.toFixed(2)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#9ca3af', marginBottom: '6px' }}>Empleado Asignado</label>
                <select
                  style={{
                    width: '100%', padding: '10px 14px', backgroundColor: '#111111',
                    border: '1px solid #3a3a3a', borderRadius: '8px',
                    color: '#ffffff', fontSize: '13px', outline: 'none',
                  }}
                >
                  <option value="">Seleccionar empleado...</option>
                  {empleados.filter((e) => e.rol !== 'Cajera').map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre} — {e.rol}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#9ca3af', marginBottom: '6px' }}>Nombre del Cliente</label>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  style={{
                    width: '100%', padding: '10px 14px', backgroundColor: '#111111',
                    border: '1px solid #3a3a3a', borderRadius: '8px',
                    color: '#ffffff', fontSize: '13px', outline: 'none',
                  }}
                />
              </div>
            </div>
            <div style={{
              display: 'flex', gap: '10px', padding: '16px 24px',
              borderTop: '1px solid #2e2e2e',
            }}>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  flex: 1, padding: '10px 0', fontSize: '13px', fontWeight: 600,
                  color: '#9ca3af', backgroundColor: '#111111', border: '1px solid #3a3a3a',
                  borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; }}
              >
                Cancelar
              </button>
              <button
                onClick={() => { setModalOpen(false); alert('Vehículo registrado exitosamente (Demo)'); }}
                style={{
                  flex: 1, padding: '10px 0', fontSize: '13px', fontWeight: 700,
                  color: '#ffffff', backgroundColor: '#dc2626', border: 'none',
                  borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#b91c1c'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#dc2626'; }}
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .kanban-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
