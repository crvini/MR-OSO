import { useState } from 'react';
import {
  DollarSign,
  Car,
  Clock,
  Star,
  TrendingUp,
  MoreVertical,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import InsightsModal from '../components/InsightsModal';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { ingresosSemana } from '../data/mockData';

const ff = "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif";

const stats = [
  {
    label: 'Ingresos Hoy',
    value: 'Q 12,450',
    change: '+12.5%',
    sub: 'vs ayer',
    icon: DollarSign,
    iconColor: '#10B981',
    iconBg: 'rgba(16,185,129,0.12)',
  },
  {
    label: 'Vehículos Atendidos',
    value: '28',
    change: '+5.2%',
    sub: 'vs ayer',
    icon: Car,
    iconColor: '#dc2626',
    iconBg: 'rgba(220,38,38,0.12)',
  },
  {
    label: 'En Proceso',
    value: '4',
    change: '+2',
    sub: 'última hora',
    icon: Clock,
    iconColor: '#F59E0B',
    iconBg: 'rgba(245,158,11,0.12)',
  },
  {
    label: 'Servicio Popular',
    value: 'Lavado Premium',
    change: null,
    sub: '42% de las ventas',
    icon: Star,
    iconColor: '#dc2626',
    iconBg: 'rgba(220,38,38,0.12)',
    isText: true,
  },
];

const actividadReciente = [
  { marca: 'Toyota Hilux', estado: 'Finalizado', color: '#dc2626', tiempo: 'Hace 5 min' },
  { marca: 'Honda CR-V', estado: 'Secado', color: '#10B981', tiempo: 'Hace 12 min' },
  { marca: 'Kia Sportage', estado: 'En Jabonado', color: '#10B981', tiempo: 'Hace 18 min' },
  { marca: 'BMW X3', estado: 'Finalizado', color: '#dc2626', tiempo: 'Hace 25 min' },
  { marca: 'Mazda CX-5', estado: 'Enjuague', color: '#F59E0B', tiempo: 'Hace 30 min' },
];

const vehiculosEnEspera = [
  { cliente: 'Cristopher De León', vehiculo: 'Toyota Hilux', placa: 'P-245-KBR', servicio: 'Lavado Premium', entrada: '08:15', estado: 'PENDIENTE' },
  { cliente: 'María Fernanda López', vehiculo: 'Honda CR-V', placa: 'P-112-MFL', servicio: 'Lavado Completo', entrada: '08:30', estado: 'EN FILA' },
  { cliente: 'Gabriela Estrada', vehiculo: 'Chevrolet Tracker', placa: 'P-345-GEM', servicio: 'Lavado Completo', entrada: '09:00', estado: 'PENDIENTE' },
  { cliente: 'Ana Lucía Morales', vehiculo: 'Kia Sportage', placa: 'P-789-ALM', servicio: 'Paquete VIP', entrada: '09:10', estado: 'EN FILA' },
];

const totalSemana = ingresosSemana.reduce((acc, d) => acc + d.ingresos, 0);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#0d0d0d', color: '#ffffff',
        padding: '10px 14px', borderRadius: '10px',
        border: '1px solid #2e2e2e', fontFamily: ff,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}>
        <p style={{ color: '#9ca3af', margin: 0, fontSize: '13px' }}>{label}</p>
        <p style={{ color: '#dc2626', fontWeight: 700, margin: '4px 0 0 0', fontSize: '17px' }}>
          Q {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: ff }} className="animate-fadeIn">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#ffffff', margin: 0, fontFamily: ff }}>
            Dashboard Principal
          </h1>
          <p style={{ fontSize: '16px', color: '#9ca3af', margin: '6px 0 0 0' }}>
            Resumen general de operaciones y métricas del día.
          </p>
        </div>
        <button
          onClick={() => setAiOpen(true)}
          className="ai-pulse"
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 9,
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
            border: 'none',
            borderRadius: 12,
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.02em',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(220,38,38,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
            fontFamily: ff,
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 14px 36px rgba(220,38,38,0.5), inset 0 1px 0 rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(220,38,38,0.35), inset 0 1px 0 rgba(255,255,255,0.15)';
          }}
        >
          <Sparkles size={17} />
          Insights con IA
        </button>
      </div>

      <InsightsModal open={aiOpen} onClose={() => setAiOpen(false)} />
      <style>{`
        @keyframes aiPulse {
          0%, 100% { box-shadow: 0 10px 30px rgba(220,38,38,0.35), inset 0 1px 0 rgba(255,255,255,0.15), 0 0 0 0 rgba(220,38,38,0.5); }
          50%      { box-shadow: 0 10px 30px rgba(220,38,38,0.35), inset 0 1px 0 rgba(255,255,255,0.15), 0 0 0 10px rgba(220,38,38,0); }
        }
        .ai-pulse { animation: aiPulse 2.4s ease-out infinite; }
      `}</style>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="stats-grid">
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              backgroundColor: '#1a1a1a', borderRadius: '14px',
              padding: '22px', border: '1px solid #2e2e2e',
              display: 'flex', flexDirection: 'column', gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>{stat.label}</span>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                backgroundColor: stat.iconBg, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <stat.icon size={20} style={{ color: stat.iconColor }} />
              </div>
            </div>
            <p style={{
              fontSize: stat.isText ? '20px' : '30px',
              fontWeight: 700, color: '#ffffff', margin: 0, lineHeight: 1.1,
              fontFamily: ff,
            }}>
              {stat.value}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {stat.change && (
                <span style={{
                  fontSize: '13px', fontWeight: 600, color: '#10B981',
                  backgroundColor: 'rgba(16,185,129,0.12)',
                  padding: '2px 10px', borderRadius: '6px',
                  display: 'inline-flex', alignItems: 'center', gap: '3px',
                }}>
                  <TrendingUp size={13} />
                  {stat.change}
                </span>
              )}
              <span style={{ fontSize: '13px', color: '#6b7280' }}>{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Estado del Lavadero */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px' }} className="chart-grid">
        {/* Weekly Income Chart */}
        <div style={{
          backgroundColor: '#1a1a1a', borderRadius: '14px',
          padding: '24px', border: '1px solid #2e2e2e',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: 0, fontFamily: ff }}>
                Ingresos Semanales
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                Resumen de ventas últimos 7 días
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '26px', fontWeight: 700, color: '#ffffff', margin: 0, fontFamily: ff }}>
                Q {totalSemana.toLocaleString()}
              </p>
              <p style={{ fontSize: '13px', color: '#10B981', margin: '2px 0 0 0', fontWeight: 600 }}>
                +8.4% de crecimiento
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ingresosSemana} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
              <XAxis dataKey="dia" tick={{ fontSize: 13, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(v) => `Q${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(220,38,38,0.06)' }} />
              <Bar dataKey="ingresos" fill="#dc2626" radius={[6, 6, 0, 0]} maxBarSize={42} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Estado del Lavadero */}
        <div style={{
          backgroundColor: '#1a1a1a', borderRadius: '14px',
          padding: '24px', border: '1px solid #2e2e2e',
          display: 'flex', flexDirection: 'column',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '0 0 16px 0', fontFamily: ff }}>
            Estado del Lavadero
          </h2>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            backgroundColor: '#111111', borderRadius: '10px',
            padding: '14px 16px', marginBottom: '20px', border: '1px solid #2e2e2e',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block', boxShadow: '0 0 8px rgba(16,185,129,0.5)' }} />
              <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 500 }}>Capacidad Actual</span>
            </div>
            <span style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', fontFamily: ff }}>85%</span>
          </div>

          <p style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
            Actividad Reciente
          </p>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {actividadReciente.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 12px', backgroundColor: '#111111', borderRadius: '8px', border: '1px solid #1e1e1e',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, display: 'inline-block', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '14px', color: '#ffffff', fontWeight: 500, margin: 0 }}>{item.marca}</p>
                    <p style={{ fontSize: '12px', color: item.color, fontWeight: 600, margin: 0 }}>{item.estado}</p>
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>{item.tiempo}</span>
              </div>
            ))}
          </div>

          <button
            style={{
              width: '100%', padding: '10px 0', marginTop: '16px',
              backgroundColor: 'transparent', border: '1px solid #dc2626', borderRadius: '10px',
              color: '#dc2626', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              transition: 'all 0.2s', letterSpacing: '0.03em',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            VER TODO EL ESTADO
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Vehículos en Espera Table */}
      <div style={{ backgroundColor: '#1a1a1a', borderRadius: '14px', padding: '24px', border: '1px solid #2e2e2e' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: 0, fontFamily: ff }}>
            Vehículos en Espera
          </h2>
          <button style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Ver Cola Completa
            <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['CLIENTE', 'VEHÍCULO', 'SERVICIO', 'ENTRADA', 'ESTADO', 'ACCIONES'].map((h) => (
                  <th key={h} style={{
                    textAlign: h === 'ACCIONES' ? 'center' : 'left',
                    padding: '12px 16px', fontSize: '11px', fontWeight: 700,
                    color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase',
                    borderBottom: '1px solid #2e2e2e', whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehiculosEnEspera.map((v, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#1a1a1a' : '#151515', borderBottom: '1px solid #1e1e1e' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', margin: 0 }}>{v.cliente}</p>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <p style={{ fontSize: '15px', color: '#ffffff', margin: 0 }}>{v.vehiculo}</p>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{v.placa}</p>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '15px', color: '#9ca3af' }}>{v.servicio}</td>
                  <td style={{ padding: '14px 16px', fontSize: '15px', color: '#9ca3af' }}>{v.entrada}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-block', fontSize: '11px', fontWeight: 700,
                      padding: '4px 12px', borderRadius: '6px', letterSpacing: '0.03em',
                      ...(v.estado === 'PENDIENTE'
                        ? { backgroundColor: 'rgba(220,38,38,0.15)', color: '#dc2626' }
                        : { backgroundColor: 'rgba(245,158,11,0.15)', color: '#F59E0B' }),
                    }}>
                      {v.estado}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <button style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '4px' }}>
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .chart-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
