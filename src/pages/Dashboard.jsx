import { useState } from 'react';
import {
  DollarSign,
  Car,
  Receipt,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  ChevronRight,
  Clock,
  Building2,
  Bike,
  Truck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  sucursales,
  HORAS,
  DIAS,
  DIA_HOY,
  resumen,
  ingresosSemana,
  heatmap,
  ranking,
  tiposVehiculo,
} from '../data/sucursales';

const ff = "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif";

const card = {
  backgroundColor: '#1a1a1a',
  borderRadius: '14px',
  border: '1px solid #2e2e2e',
  padding: '22px',
};

const colaEspera = [
  { cliente: 'Cristopher De León', vehiculo: 'Toyota Hilux', placa: 'P-245-KBR', tipo: 'Carro', servicio: 'Lavado Premium', entrada: '08:15', estado: 'PENDIENTE', suc: 'centro' },
  { cliente: 'María Fernanda López', vehiculo: 'Honda CR-V', placa: 'P-112-MFL', tipo: 'Carro', servicio: 'Lavado Completo', entrada: '08:30', estado: 'EN FILA', suc: 'roosevelt' },
  { cliente: 'Gabriela Estrada', vehiculo: 'Chevrolet Tracker', placa: 'P-345-GEM', tipo: 'Carro', servicio: 'Lavado Completo', entrada: '09:00', estado: 'PENDIENTE', suc: 'zona10' },
  { cliente: 'Ana Lucía Morales', vehiculo: 'Kia Sportage', placa: 'P-789-ALM', tipo: 'Carro', servicio: 'Paquete VIP', entrada: '09:10', estado: 'EN FILA', suc: 'villanueva' },
  { cliente: 'Diego Vásquez', vehiculo: 'Mitsubishi L200', placa: 'M-223-DAV', tipo: 'Camión', servicio: 'Detailing Interior', entrada: '09:25', estado: 'PENDIENTE', suc: 'roosevelt' },
  { cliente: 'Luis Argueta', vehiculo: 'Honda CB190', placa: 'M-908-LAR', tipo: 'Moto', servicio: 'Lavado Básico', entrada: '09:40', estado: 'EN FILA', suc: 'mixco' },
];

const iconoTipo = { Carros: Car, Motos: Bike, Camiones: Truck };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      backgroundColor: '#0d0d0d', color: '#fff', padding: '10px 14px',
      borderRadius: '10px', border: '1px solid #2e2e2e', fontFamily: ff,
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    }}>
      <p style={{ color: '#9ca3af', margin: 0, fontSize: '13px' }}>{label}</p>
      <p style={{ color: '#dc2626', fontWeight: 700, margin: '4px 0 0', fontSize: '17px' }}>
        Q {payload[0].value.toLocaleString()}
      </p>
    </div>
  );
};

export default function Dashboard() {
  const [suc, setSuc] = useState('todas');

  const r = resumen(suc);
  const semana = ingresosSemana(suc);
  const mapa = heatmap(suc);
  const tipos = tiposVehiculo(suc);
  const rank = ranking();
  const totalSemana = semana.reduce((a, d) => a + d.ingresos, 0);
  const nombreSuc = suc === 'todas'
    ? 'las 5 sucursales'
    : sucursales.find((s) => s.id === suc)?.nombre;

  const stats = [
    { label: 'Ingresos Hoy', value: `Q ${r.ingresos.toLocaleString()}`, sub: 'viernes', icon: DollarSign, color: '#10B981' },
    { label: 'Vehículos Hoy', value: String(r.vehiculos), sub: 'atendidos', icon: Car, color: '#dc2626' },
    { label: 'Ticket Promedio', value: `Q ${r.ticketPromedio}`, sub: 'por vehículo', icon: Receipt, color: '#F59E0B' },
    { label: 'Hora Pico', value: r.horaPico, sub: `más floja: ${r.horaValle}`, icon: Clock, color: '#3B82F6' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: ff }} className="animate-fadeIn">

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#fff', margin: 0, fontFamily: ff }}>
          Dashboard Principal
        </h1>
        <p style={{ fontSize: '16px', color: '#9ca3af', margin: '6px 0 0' }}>
          Resumen de operaciones y métricas de {nombreSuc}.
        </p>
      </div>

      {/* Selector de sucursal */}
      <div style={{ ...card, padding: '16px 18px' }}>
        <p style={{
          fontSize: '11px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.08em',
          textTransform: 'uppercase', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Building2 size={13} color="#dc2626" />
          Sucursal
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[{ id: 'todas', nombre: 'Todas' }, ...sucursales].map((s) => {
            const activo = suc === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSuc(s.id)}
                style={{
                  padding: '8px 16px', borderRadius: 9, cursor: 'pointer',
                  fontSize: 13, fontWeight: activo ? 700 : 500, fontFamily: ff,
                  border: activo ? 'none' : '1px solid #3a3a3a',
                  backgroundColor: activo ? '#dc2626' : 'transparent',
                  color: activo ? '#fff' : '#9ca3af',
                  transition: 'all 0.15s',
                }}
              >
                {s.nombre}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} style={{ ...card, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>{s.label}</span>
              <div style={{
                width: 38, height: 38, borderRadius: 10, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                backgroundColor: `${s.color}1f`,
              }}>
                <s.icon size={20} style={{ color: s.color }} />
              </div>
            </div>
            <p style={{ fontSize: '30px', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.1, fontFamily: ff }}>
              {s.value}
            </p>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>{s.sub}</span>
          </div>
        ))}
      </div>

      {/* Insight de descansos */}
      <div style={{
        ...card, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14,
        borderLeft: '3px solid #3B82F6', flexWrap: 'wrap',
      }}>
        <TrendingDown size={20} color="#3B82F6" style={{ flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: 14, color: '#d1d5db', lineHeight: 1.5 }}>
          La hora más floja de {nombreSuc} es <strong style={{ color: '#fff' }}>{r.horaValle}</strong>.
          El punto más muerto de la semana es{' '}
          <strong style={{ color: '#fff' }}>{mapa.celdaMin.dia} {mapa.celdaMin.hora}:00</strong>
          {' '}({mapa.celdaMin.v} vehículos) — es ahí donde conviene mover los descansos del personal,
          no en el pico de <strong style={{ color: '#fff' }}>{mapa.celdaMax.dia} {mapa.celdaMax.hora}:00</strong>.
        </p>
      </div>

      {/* Comparativa de sucursales + Tipos de vehículo */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px' }} className="chart-grid">
        <div style={card}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0, fontFamily: ff }}>
            Comparativa de Sucursales
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 18px' }}>
            Ingresos de la semana — cuál está generando más
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rank.map((s, i) => {
              const pct = Math.round((s.ingresos / rank[0].ingresos) * 100);
              const esActual = suc === s.id;
              return (
                <div key={s.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 13.5, color: esActual ? '#fff' : '#9ca3af', fontWeight: esActual ? 700 : 500 }}>
                      {i === 0 && '🏆 '}{s.nombre}
                      <span style={{ color: '#4b5563', fontWeight: 400 }}> · {s.zona}</span>
                    </span>
                    <span style={{ fontSize: 13.5, color: '#fff', fontWeight: 600 }}>
                      Q {s.ingresos.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ height: 8, backgroundColor: '#111', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`, height: '100%', borderRadius: 4,
                      background: esActual || suc === 'todas'
                        ? 'linear-gradient(90deg, #dc2626, #991b1b)'
                        : '#3a3a3a',
                      transition: 'width 0.3s',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0, fontFamily: ff }}>
            Tipo de Vehículo
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 18px' }}>
            Atendidos hoy
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tipos.map((t) => {
              const Icono = iconoTipo[t.tipo];
              return (
                <div key={t.tipo} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px', backgroundColor: '#111',
                  borderRadius: 10, border: '1px solid #1e1e1e',
                }}>
                  <Icono size={18} color="#dc2626" style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 14, color: '#fff', fontWeight: 500 }}>{t.tipo}</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: ff }}>{t.cantidad}</span>
                  <span style={{
                    fontSize: 11.5, fontWeight: 700, color: '#9ca3af',
                    backgroundColor: '#1f1f1f', padding: '3px 9px', borderRadius: 6, minWidth: 44, textAlign: 'center',
                  }}>
                    {t.pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Heatmap día x hora */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0, fontFamily: ff }}>
              Carga por Día y Hora
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0' }}>
              Vehículos atendidos — entre más rojo, más ocupado
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#6b7280' }}>Flojo</span>
            {[0.08, 0.3, 0.55, 0.78, 1].map((o) => (
              <span key={o} style={{
                width: 18, height: 12, borderRadius: 3,
                backgroundColor: `rgba(220,38,38,${o})`, border: '1px solid #2e2e2e',
              }} />
            ))}
            <span style={{ fontSize: 11, color: '#6b7280' }}>Lleno</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'separate', borderSpacing: '3px', minWidth: 640 }}>
            <thead>
              <tr>
                <th style={{ width: 44 }} />
                {HORAS.map((h) => (
                  <th key={h} style={{ fontSize: 10.5, color: '#6b7280', fontWeight: 600, paddingBottom: 4 }}>
                    {h}h
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DIAS.map((dia) => (
                <tr key={dia}>
                  <td style={{
                    fontSize: 12, fontWeight: dia === DIA_HOY ? 700 : 500,
                    color: dia === DIA_HOY ? '#fff' : '#9ca3af', textAlign: 'right', paddingRight: 6,
                  }}>
                    {dia}
                  </td>
                  {HORAS.map((h) => {
                    const v = mapa.celdas[dia][h];
                    const intensidad = mapa.max > 0 ? v / mapa.max : 0;
                    const esMin = mapa.celdaMin.dia === dia && mapa.celdaMin.hora === h;
                    return (
                      <td
                        key={h}
                        title={`${dia} ${h}:00 — ${v} vehículos`}
                        style={{
                          width: 42, height: 30, borderRadius: 5, textAlign: 'center',
                          fontSize: 11, fontWeight: 600,
                          color: intensidad > 0.45 ? '#fff' : '#6b7280',
                          backgroundColor: `rgba(220,38,38,${(0.06 + intensidad * 0.94).toFixed(2)})`,
                          border: esMin ? '1.5px solid #3B82F6' : '1px solid #1e1e1e',
                          cursor: 'default',
                        }}
                      >
                        {v}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ingresos por día */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0, fontFamily: ff }}>
              Ingresos por Día
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0' }}>
              Semana actual · {nombreSuc}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '26px', fontWeight: 700, color: '#fff', margin: 0, fontFamily: ff }}>
              Q {totalSemana.toLocaleString()}
            </p>
            <p style={{ fontSize: '13px', color: '#10B981', margin: '2px 0 0', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <TrendingUp size={13} /> +8.4% vs semana pasada
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={semana} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
            <XAxis dataKey="dia" tick={{ fontSize: 13, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(v) => `Q${Math.round(v / 1000)}k`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(220,38,38,0.06)' }} />
            <Bar dataKey="ingresos" fill="#dc2626" radius={[6, 6, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cola */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0, fontFamily: ff }}>
            Vehículos en Espera
          </h2>
          <button style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            Ver Cola Completa <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['CLIENTE', 'VEHÍCULO', 'TIPO', 'SUCURSAL', 'SERVICIO', 'ENTRADA', 'ESTADO', ''].map((h) => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 700,
                    color: '#6b7280', letterSpacing: '0.08em', borderBottom: '1px solid #2e2e2e', whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {colaEspera
                .filter((v) => suc === 'todas' || v.suc === suc)
                .map((v, i) => (
                  <tr key={v.placa} style={{ backgroundColor: i % 2 === 0 ? '#1a1a1a' : '#151515', borderBottom: '1px solid #1e1e1e' }}>
                    <td style={{ padding: '14px 16px', fontSize: 15, fontWeight: 600, color: '#fff' }}>{v.cliente}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ fontSize: 15, color: '#fff', margin: 0 }}>{v.vehiculo}</p>
                      <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{v.placa}</p>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#9ca3af' }}>{v.tipo}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#9ca3af' }}>
                      {sucursales.find((s) => s.id === v.suc)?.nombre}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 15, color: '#9ca3af' }}>{v.servicio}</td>
                    <td style={{ padding: '14px 16px', fontSize: 15, color: '#9ca3af' }}>{v.entrada}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-block', fontSize: 11, fontWeight: 700,
                        padding: '4px 12px', borderRadius: 6,
                        ...(v.estado === 'PENDIENTE'
                          ? { backgroundColor: 'rgba(220,38,38,0.15)', color: '#dc2626' }
                          : { backgroundColor: 'rgba(245,158,11,0.15)', color: '#F59E0B' }),
                      }}>
                        {v.estado}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <button style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 4 }}>
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
