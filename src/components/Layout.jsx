import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ListOrdered,
  Sparkles,
  DollarSign,
  Users,
  LogOut,
  Menu,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/turnos', label: 'Turnos', icon: ListOrdered },
  { to: '/servicios', label: 'Servicios', icon: Sparkles },
  { to: '/caja', label: 'Caja', icon: DollarSign },
  { to: '/clientes', label: 'Clientes', icon: Users },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#111111' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden"
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 30 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          width: '220px',
          minWidth: '220px',
          backgroundColor: '#000000',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #1a1a1a',
        }}
      >
        {/* Logo — centered, no text */}
        <div style={{ padding: '20px 0', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'center' }}>
          <img
            src="/logo.jpeg"
            alt="Mr Oso"
            style={{ width: '120px', height: 'auto', objectFit: 'contain', display: 'block' }}
          />
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#ffffff' : '#9ca3af',
                backgroundColor: isActive ? '#dc2626' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s',
              })}
              className="sidebar-nav-item"
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section: DEMO + User */}
        <div style={{ padding: '16px', borderTop: '1px solid #1a1a1a' }}>
          {/* DEMO Badge */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: 'rgba(220, 38, 38, 0.15)',
              color: '#dc2626',
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 16px',
              borderRadius: '20px',
              letterSpacing: '0.1em',
              border: '1px solid rgba(220, 38, 38, 0.3)',
            }}>
              DEMO
            </span>
            <p style={{ fontSize: '10px', color: '#4b5563', margin: '6px 0 0 0' }}>
              Versión de prueba activa
            </p>
          </div>

          {/* User Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 700,
              color: '#ffffff',
              flexShrink: 0,
            }}>
              {user?.nombre?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '12px', color: '#ffffff', margin: 0, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                admin@mroso.com
              </p>
              <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>
                Administrador
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              fontSize: '12px',
              color: '#6b7280',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginTop: '4px',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Mobile hamburger — only visible on small screens */}
        <div className="lg:hidden" style={{
          position: 'fixed', top: '12px', left: '12px', zIndex: 20,
        }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              padding: '8px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #2e2e2e',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            }}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <Outlet />
        </main>
      </div>

      {/* Inline hover styles for nav items */}
      <style>{`
        .sidebar-nav-item:hover {
          color: #ffffff !important;
          background-color: rgba(255,255,255,0.05) !important;
        }
        .sidebar-nav-item[aria-current="page"]:hover {
          background-color: #dc2626 !important;
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
}
