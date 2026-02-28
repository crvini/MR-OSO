import { useState } from 'react';
import {
  Plus,
  Clock,
  X,
  Pencil,
  Trash2,
  Droplets,
  SprayCan,
  Crown,
  Armchair,
  PaintBucket,
  CircleDot,
  Cog,
  Star,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { servicios as serviciosData } from '../data/mockData';

const iconMap = [
  { icon: Droplets, bg: '#2563EB' },
  { icon: SprayCan, bg: '#7C3AED' },
  { icon: Crown, bg: '#F59E0B' },
  { icon: Armchair, bg: '#10B981' },
  { icon: PaintBucket, bg: '#EC4899' },
  { icon: CircleDot, bg: '#3B82F6' },
  { icon: Cog, bg: '#EF4444' },
  { icon: Star, bg: '#F97316' },
];

export default function Servicios() {
  const [serviciosList, setServiciosList] = useState(serviciosData);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleActivo = (id) => {
    setServiciosList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, activo: !s.activo } : s))
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif" }} className="animate-fadeIn">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#ffffff', margin: 0, fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif" }}>
            Catálogo de Servicios
          </h1>
          <p style={{ fontSize: '16px', color: '#9ca3af', margin: '6px 0 0 0' }}>
            Configura y gestiona los paquetes de detallado automotriz.
          </p>
        </div>
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

      {/* Services Table */}
      <div style={{
        backgroundColor: '#1a1a1a', borderRadius: '14px',
        border: '1px solid #2e2e2e', overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['NOMBRE DEL SERVICIO', 'PRECIO', 'DURACIÓN', 'ESTADO', 'ACCIONES'].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: h === 'ACCIONES' ? 'center' : 'left',
                      padding: '14px 20px',
                      fontSize: '11px', fontWeight: 700,
                      color: '#6b7280', letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #2e2e2e',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {serviciosList.map((servicio, i) => {
                const iconInfo = iconMap[i % iconMap.length];
                const IconComp = iconInfo.icon;
                return (
                  <tr
                    key={servicio.id}
                    style={{
                      borderBottom: '1px solid #222222',
                      transition: 'background-color 0.15s',
                      cursor: 'default',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#222222'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    {/* Service Name */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '8px',
                          backgroundColor: `${iconInfo.bg}20`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <IconComp size={18} style={{ color: iconInfo.bg }} />
                        </div>
                        <span style={{
                          fontSize: '15px', fontWeight: 600, color: '#ffffff',
                          opacity: servicio.activo ? 1 : 0.5,
                        }}>
                          {servicio.nombre}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        fontSize: '15px', fontWeight: 600, color: '#ffffff',
                        opacity: servicio.activo ? 1 : 0.5,
                      }}>
                        Q {servicio.precio.toFixed(2)}
                      </span>
                    </td>

                    {/* Duration */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        opacity: servicio.activo ? 1 : 0.5,
                      }}>
                        <Clock size={14} style={{ color: '#6b7280' }} />
                        <span style={{ fontSize: '14px', color: '#9ca3af' }}>
                          {servicio.duracion} min
                        </span>
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          onClick={() => toggleActivo(servicio.id)}
                          style={{
                            position: 'relative',
                            width: '40px', height: '22px',
                            borderRadius: '11px',
                            border: 'none', cursor: 'pointer',
                            backgroundColor: servicio.activo ? '#dc2626' : '#3a3a3a',
                            transition: 'background-color 0.3s',
                            padding: 0, flexShrink: 0,
                          }}
                        >
                          <div style={{
                            position: 'absolute',
                            top: '2px',
                            left: servicio.activo ? '20px' : '2px',
                            width: '18px', height: '18px',
                            borderRadius: '50%',
                            backgroundColor: '#ffffff',
                            transition: 'left 0.3s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                          }} />
                        </button>
                        <span style={{
                          fontSize: '14px', fontWeight: 600,
                          color: servicio.activo ? '#10B981' : '#6b7280',
                        }}>
                          {servicio.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <button
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '6px', borderRadius: '6px', color: '#9ca3af',
                            display: 'flex', transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.backgroundColor = '#2a2a2a'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '6px', borderRadius: '6px', color: '#dc2626',
                            display: 'flex', transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.1)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderTop: '1px solid #2e2e2e', flexWrap: 'wrap', gap: '10px',
        }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>
            Mostrando {serviciosList.length} de {serviciosList.length} servicios
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button style={{
              padding: '6px 10px', fontSize: '12px', fontWeight: 500,
              color: '#6b7280', backgroundColor: 'transparent',
              border: '1px solid #3a3a3a', borderRadius: '6px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              <ChevronLeft size={14} />
              Anterior
            </button>
            <button style={{
              width: '30px', height: '30px', fontSize: '12px', fontWeight: 700,
              color: '#ffffff', backgroundColor: '#dc2626',
              border: 'none', borderRadius: '6px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              1
            </button>
            <button style={{
              padding: '6px 10px', fontSize: '12px', fontWeight: 500,
              color: '#6b7280', backgroundColor: 'transparent',
              border: '1px solid #3a3a3a', borderRadius: '6px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              Siguiente
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 3 Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }} className="stats-cards-grid">
        {/* Most Popular */}
        <div style={{
          backgroundColor: '#1a1a1a', borderRadius: '14px',
          padding: '22px', border: '1px solid #2e2e2e',
        }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
            Servicio Más Popular
          </p>
          <p style={{ fontSize: '26px', fontWeight: 700, color: '#dc2626', margin: '0 0 6px 0' }}>
            Lavado Premium
          </p>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            42% de las ventas mensuales
          </p>
        </div>

        {/* Average Ticket */}
        <div style={{
          backgroundColor: '#1a1a1a', borderRadius: '14px',
          padding: '22px', border: '1px solid #2e2e2e',
        }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
            Ticket Promedio
          </p>
          <p style={{ fontSize: '26px', fontWeight: 700, color: '#ffffff', margin: '0 0 6px 0' }}>
            Q 42.50
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={13} style={{ color: '#10B981' }} />
            <span style={{ fontSize: '14px', color: '#10B981', fontWeight: 600 }}>12% desde el mes pasado</span>
          </div>
        </div>

        {/* Average Time */}
        <div style={{
          backgroundColor: '#1a1a1a', borderRadius: '14px',
          padding: '22px', border: '1px solid #2e2e2e',
        }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
            Tiempo Promedio
          </p>
          <p style={{ fontSize: '26px', fontWeight: 700, color: '#ffffff', margin: '0 0 6px 0' }}>
            68 min
          </p>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            Optimizado un 5%
          </p>
        </div>
      </div>

      {/* Modal Nuevo Servicio */}
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
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: 0, fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif" }}>Nuevo Servicio</h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6b7280' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#9ca3af', marginBottom: '6px' }}>Nombre del Servicio</label>
                <input
                  type="text"
                  placeholder="Ej: Lavado Express"
                  style={{
                    width: '100%', padding: '10px 14px', backgroundColor: '#111111',
                    border: '1px solid #3a3a3a', borderRadius: '8px',
                    color: '#ffffff', fontSize: '13px', outline: 'none',
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#9ca3af', marginBottom: '6px' }}>Precio (Q)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    style={{
                      width: '100%', padding: '10px 14px', backgroundColor: '#111111',
                      border: '1px solid #3a3a3a', borderRadius: '8px',
                      color: '#ffffff', fontSize: '13px', outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#9ca3af', marginBottom: '6px' }}>Duración (min)</label>
                  <input
                    type="number"
                    placeholder="30"
                    style={{
                      width: '100%', padding: '10px 14px', backgroundColor: '#111111',
                      border: '1px solid #3a3a3a', borderRadius: '8px',
                      color: '#ffffff', fontSize: '13px', outline: 'none',
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#9ca3af', marginBottom: '6px' }}>Descripción</label>
                <textarea
                  rows={3}
                  placeholder="Describe el servicio..."
                  style={{
                    width: '100%', padding: '10px 14px', backgroundColor: '#111111',
                    border: '1px solid #3a3a3a', borderRadius: '8px',
                    color: '#ffffff', fontSize: '13px', outline: 'none',
                    resize: 'none',
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
                onClick={() => { setModalOpen(false); alert('Servicio agregado exitosamente (Demo)'); }}
                style={{
                  flex: 1, padding: '10px 0', fontSize: '13px', fontWeight: 700,
                  color: '#ffffff', backgroundColor: '#dc2626', border: 'none',
                  borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#b91c1c'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#dc2626'; }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .stats-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
