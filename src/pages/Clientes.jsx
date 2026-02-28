import { useState } from 'react';
import {
  Search,
  Plus,
  X,
  Bell,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Users,
  CalendarDays,
  Car,
  UserPlus,
} from 'lucide-react';

const clientesData = [
  {
    id: 1, nombre: 'Cristopher De León', telefono: '5555-1234',
    vehiculos: [
      { placa: 'P-245-KBR', desc: 'Toyota Hilux' },
      { placa: 'P-112-MFL', desc: 'Honda CR-V' },
    ],
    ultimaVisita: 'Hoy',
  },
  {
    id: 2, nombre: 'María Fernanda López', telefono: '4212-8876',
    vehiculos: [{ placa: 'M-223-DAV', desc: 'Mitsubishi L200' }],
    ultimaVisita: '26 Feb, 2026',
  },
  {
    id: 3, nombre: 'José Roberto Castillo', telefono: '3344-5567',
    vehiculos: [{ placa: 'P-567-CEP', desc: 'Hyundai Tucson' }],
    ultimaVisita: '25 Feb, 2026',
  },
  {
    id: 4, nombre: 'Ana Lucía Morales', telefono: '5590-3321',
    vehiculos: [
      { placa: 'P-789-ALM', desc: 'Kia Sportage' },
      { placa: 'P-901-SAR', desc: 'Toyota RAV4' },
    ],
    ultimaVisita: 'Hoy',
  },
  {
    id: 5, nombre: 'Carlos Eduardo Pérez', telefono: '4478-9912',
    vehiculos: [{ placa: 'P-678-DAV', desc: 'BMW X3' }],
    ultimaVisita: '24 Feb, 2026',
  },
  {
    id: 6, nombre: 'Sofía Alejandra Ruiz', telefono: '3012-4456',
    vehiculos: [{ placa: 'P-345-GEM', desc: 'Chevrolet Tracker' }],
    ultimaVisita: '23 Feb, 2026',
  },
  {
    id: 7, nombre: 'Diego Alejandro Vásquez', telefono: '5534-2211',
    vehiculos: [
      { placa: 'M-456-JRC', desc: 'Ford Ranger' },
      { placa: 'P-334-ALM', desc: 'Mazda 3' },
    ],
    ultimaVisita: 'Hoy',
  },
  {
    id: 8, nombre: 'Gabriela Estrada Monzón', telefono: '4190-7788',
    vehiculos: [{ placa: 'P-891-DFG', desc: 'Nissan Kicks' }],
    ultimaVisita: '22 Feb, 2026',
  },
];

const totalVehiculos = clientesData.reduce((a, c) => a + c.vehiculos.length, 0);

const statCards = [
  { label: 'Total Clientes', value: '8', icon: Users },
  { label: 'Visitas del Mes', value: '177', icon: CalendarDays },
  { label: 'Vehículos Activos', value: String(totalVehiculos), icon: Car },
  { label: 'Clientes Nuevos', value: '3', icon: UserPlus },
];

const avatarColors = ['#dc2626', '#7C3AED', '#2563EB', '#F59E0B', '#10B981', '#EC4899', '#3B82F6', '#EF4444'];

export default function Clientes() {
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [modalOpen, setModalOpen] = useState(false);

  const clientesFiltrados = clientesData.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.vehiculos.some((v) =>
      v.placa.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.desc.toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  const getInitials = (nombre) => {
    const parts = nombre.split(' ');
    return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif" }} className="animate-fadeIn">

      {/* Header Bar */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '16px',
      }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#ffffff', margin: 0, fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif" }}>
            Gestión de Clientes
          </h1>
          <p style={{ fontSize: '16px', color: '#9ca3af', margin: '6px 0 0 0' }}>
            Administra la base de datos de clientes, vehículos y sus visitas.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por placa, nombre o modelo..."
              style={{
                backgroundColor: '#111111', border: '1px solid #3a3a3a',
                borderRadius: '8px', color: '#ffffff', fontSize: '13px',
                padding: '8px 12px 8px 32px', outline: 'none', width: '260px',
              }}
            />
          </div>
          <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#9ca3af' }}>
            <Bell size={20} />
            <span style={{
              position: 'absolute', top: '2px', right: '2px',
              width: '8px', height: '8px', backgroundColor: '#dc2626',
              borderRadius: '50%', border: '2px solid #111111',
            }} />
          </button>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              backgroundColor: '#dc2626', color: '#ffffff',
              padding: '8px 16px', borderRadius: '8px',
              border: 'none', cursor: 'pointer',
              fontSize: '12px', fontWeight: 700,
              boxShadow: '0 4px 15px rgba(220,38,38,0.3)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#b91c1c'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#dc2626'; }}
          >
            <Plus size={14} />
            Registrar Cliente
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }} className="stat-cards-grid">
        {statCards.map((s) => (
          <div key={s.label} style={{
            backgroundColor: '#1a1a1a', borderRadius: '12px',
            padding: '20px', border: '1px solid #2e2e2e',
            borderTop: '3px solid #dc2626',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
                {s.label}
              </p>
              <s.icon size={16} style={{ color: '#4b5563' }} />
            </div>
            <p style={{ fontSize: '30px', fontWeight: 800, color: '#ffffff', margin: 0, lineHeight: 1 }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['todos', 'frecuentes', 'nuevos'].map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              style={{
                padding: '7px 16px', borderRadius: '8px', cursor: 'pointer',
                fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
                border: filtro === f ? 'none' : '1px solid #3a3a3a',
                backgroundColor: filtro === f ? '#dc2626' : 'transparent',
                color: filtro === f ? '#ffffff' : '#9ca3af',
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '13px', color: '#6b7280', fontWeight: 500,
        }}>
          <SlidersHorizontal size={14} />
          Filtros Avanzados
        </button>
      </div>

      {/* Clients Table */}
      <div style={{
        backgroundColor: '#1a1a1a', borderRadius: '14px',
        border: '1px solid #2e2e2e', overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['CLIENTE', 'TELÉFONO', 'VEHÍCULOS ASOCIADOS', 'ÚLTIMA VISITA', 'ACCIONES'].map((h) => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '14px 20px',
                    fontSize: '11px', fontWeight: 700, color: '#6b7280',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    borderBottom: '1px solid #2e2e2e', whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((c, i) => (
                <tr
                  key={c.id}
                  style={{ borderBottom: '1px solid #222222', transition: 'background-color 0.15s', cursor: 'default' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#222222'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  {/* Cliente */}
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        backgroundColor: avatarColors[i % avatarColors.length],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '13px', fontWeight: 700, color: '#ffffff', flexShrink: 0,
                      }}>
                        {getInitials(c.nombre)}
                      </div>
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', margin: 0 }}>{c.nombre}</p>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>ID: #{String(c.id).padStart(4, '0')}</p>
                      </div>
                    </div>
                  </td>

                  {/* Teléfono */}
                  <td style={{ padding: '16px 20px', fontSize: '15px', color: '#ffffff' }}>
                    {c.telefono}
                  </td>

                  {/* Vehículos */}
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {c.vehiculos.map((v) => (
                        <span key={v.placa} style={{
                          display: 'inline-block', fontSize: '13px', fontWeight: 600,
                          color: '#dc2626', backgroundColor: 'transparent',
                          border: '1px solid rgba(220,38,38,0.35)',
                          padding: '3px 10px', borderRadius: '6px',
                          whiteSpace: 'nowrap', width: 'fit-content',
                        }}>
                          {v.placa} ({v.desc})
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Última Visita */}
                  <td style={{ padding: '16px 20px', fontSize: '15px', color: '#ffffff', whiteSpace: 'nowrap' }}>
                    {c.ultimaVisita}
                  </td>

                  {/* Acciones */}
                  <td style={{ padding: '16px 20px' }}>
                    <button style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '13px', fontWeight: 600, color: '#dc2626',
                      padding: 0, transition: 'opacity 0.2s',
                    }}>
                      Ver Historial
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {clientesFiltrados.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', opacity: 0.3 }}>
            <Users size={40} style={{ color: '#6b7280' }} />
            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>No se encontraron clientes</p>
          </div>
        )}

        {/* Pagination */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderTop: '1px solid #2e2e2e', flexWrap: 'wrap', gap: '10px',
        }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>
            Mostrando 1 a {clientesFiltrados.length} de {clientesFiltrados.length} clientes
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button style={{
              width: '30px', height: '30px', fontSize: '13px',
              color: '#6b7280', backgroundColor: 'transparent',
              border: '1px solid #3a3a3a', borderRadius: '6px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ChevronLeft size={14} />
            </button>
            {[1, 2, 3].map((n) => (
              <button key={n} style={{
                width: '30px', height: '30px', fontSize: '12px', fontWeight: n === 1 ? 700 : 500,
                color: n === 1 ? '#ffffff' : '#6b7280',
                backgroundColor: n === 1 ? '#dc2626' : 'transparent',
                border: n === 1 ? 'none' : '1px solid #3a3a3a',
                borderRadius: '6px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {n}
              </button>
            ))}
            <button style={{
              width: '30px', height: '30px', fontSize: '13px',
              color: '#6b7280', backgroundColor: 'transparent',
              border: '1px solid #3a3a3a', borderRadius: '6px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Registrar Cliente */}
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
              border: '1px solid #2e2e2e', width: '100%', maxWidth: '440px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            }}
            className="animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px', borderBottom: '1px solid #2e2e2e',
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: 0, fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif" }}>Registrar Cliente</h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6b7280' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#9ca3af', marginBottom: '6px' }}>Nombre Completo</label>
                <input type="text" placeholder="Nombre del cliente" style={{
                  width: '100%', padding: '10px 14px', backgroundColor: '#111111',
                  border: '1px solid #3a3a3a', borderRadius: '8px',
                  color: '#ffffff', fontSize: '13px', outline: 'none',
                }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#9ca3af', marginBottom: '6px' }}>Teléfono</label>
                  <input type="tel" placeholder="0000-0000" style={{
                    width: '100%', padding: '10px 14px', backgroundColor: '#111111',
                    border: '1px solid #3a3a3a', borderRadius: '8px',
                    color: '#ffffff', fontSize: '13px', outline: 'none',
                  }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#9ca3af', marginBottom: '6px' }}>Email</label>
                  <input type="email" placeholder="email@ejemplo.com" style={{
                    width: '100%', padding: '10px 14px', backgroundColor: '#111111',
                    border: '1px solid #3a3a3a', borderRadius: '8px',
                    color: '#ffffff', fontSize: '13px', outline: 'none',
                  }} />
                </div>
              </div>
              <div style={{ height: '1px', backgroundColor: '#2e2e2e' }} />
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#9ca3af', margin: 0 }}>Vehículo</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#6b7280', marginBottom: '4px' }}>Placa</label>
                  <input type="text" placeholder="P-000-XXX" style={{
                    width: '100%', padding: '10px 14px', backgroundColor: '#111111',
                    border: '1px solid #3a3a3a', borderRadius: '8px',
                    color: '#ffffff', fontSize: '13px', outline: 'none',
                  }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#6b7280', marginBottom: '4px' }}>Marca</label>
                  <input type="text" placeholder="Toyota" style={{
                    width: '100%', padding: '10px 14px', backgroundColor: '#111111',
                    border: '1px solid #3a3a3a', borderRadius: '8px',
                    color: '#ffffff', fontSize: '13px', outline: 'none',
                  }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#6b7280', marginBottom: '4px' }}>Modelo</label>
                  <input type="text" placeholder="Corolla" style={{
                    width: '100%', padding: '10px 14px', backgroundColor: '#111111',
                    border: '1px solid #3a3a3a', borderRadius: '8px',
                    color: '#ffffff', fontSize: '13px', outline: 'none',
                  }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#6b7280', marginBottom: '4px' }}>Color</label>
                  <input type="text" placeholder="Blanco" style={{
                    width: '100%', padding: '10px 14px', backgroundColor: '#111111',
                    border: '1px solid #3a3a3a', borderRadius: '8px',
                    color: '#ffffff', fontSize: '13px', outline: 'none',
                  }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#6b7280', marginBottom: '4px' }}>Año</label>
                  <input type="number" placeholder="2024" style={{
                    width: '100%', padding: '10px 14px', backgroundColor: '#111111',
                    border: '1px solid #3a3a3a', borderRadius: '8px',
                    color: '#ffffff', fontSize: '13px', outline: 'none',
                  }} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', padding: '16px 24px', borderTop: '1px solid #2e2e2e' }}>
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
                onClick={() => { setModalOpen(false); alert('Cliente registrado exitosamente (Demo)'); }}
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
        @media (max-width: 1024px) {
          .stat-cards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .stat-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
