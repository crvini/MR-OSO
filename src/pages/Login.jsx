import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const inputStyle = {
  backgroundColor: '#1f2937',
  border: '1px solid #4b5563',
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: '14px',
  width: '100%',
  outline: 'none',
};

const inputEmailStyle = {
  ...inputStyle,
  padding: '14px 16px 14px 48px',
};

const inputPasswordStyle = {
  ...inputStyle,
  padding: '14px 52px 14px 48px',
};

export default function Login() {
  const [email, setEmail] = useState('admin@mroso.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    login(email || 'Ana García');
    navigate('/dashboard');
  };

  const focusBorder = '1px solid #ef4444';
  const normalBorder = '1px solid #4b5563';

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '16px' }}>
      {/* Background image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.72)' }} />

      {/* Card */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#000000',
        borderRadius: '20px',
        border: 'none',
        boxShadow: '0 0 30px rgba(255,255,255,0.06), 0 0 80px rgba(255,255,255,0.03)',
        paddingTop: '40px',
        paddingBottom: '40px',
        paddingLeft: '40px',
        paddingRight: '40px',
      }}>
          {/* Logo inside card */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '150px',
              height: '100px',
            }}>
              <img
                src="/logo.jpeg"
                alt="Mr Oso Company"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Header */}
          <h1 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#ffffff',
            textAlign: 'center',
            margin: 0,
            fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          }}>
            Sistema de Gestión
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#9ca3af',
            textAlign: 'center',
            marginTop: '8px',
            marginBottom: '40px',
          }}>
            Ingresa tus credenciales para continuar
          </p>

          {/* Form */}
          <form onSubmit={handleLogin}>
            {/* Email field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#d1d5db', marginBottom: '10px' }}>
                Correo Electrónico
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={20}
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }}
                />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  placeholder="ejemplo@mroso.com"
                  style={{
                    ...inputEmailStyle,
                    border: emailFocus ? focusBorder : normalBorder,
                    boxShadow: emailFocus ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : 'none',
                  }}
                />
              </div>
            </div>

            {/* Password field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#d1d5db', marginBottom: '10px' }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={20}
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPassFocus(true)}
                  onBlur={() => setPassFocus(false)}
                  placeholder="••••••••"
                  style={{
                    ...inputPasswordStyle,
                    border: passFocus ? focusBorder : normalBorder,
                    boxShadow: passFocus ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#dc2626', borderRadius: '4px' }}
                />
                <span style={{ fontSize: '13px', color: '#9ca3af' }}>Recordarme</span>
              </label>
              <button
                type="button"
                style={{ fontSize: '13px', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '15px',
                padding: '15px 0',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 10px 25px rgba(185, 28, 28, 0.3)',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            >
              Entrar
              <LogIn size={20} />
            </button>
          </form>

          {/* Demo hint */}
          <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginTop: '16px', fontStyle: 'italic' }}>
            Demo: usa las credenciales prellenadas
          </p>

          {/* Copyright */}
          <p style={{ fontSize: '11px', color: '#4b5563', textAlign: 'center', marginTop: '32px' }}>
            © 2026 Mr Oso SaaS. Todos los derechos reservados.
          </p>
      </div>

      {/* Bottom status bar */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '32px', marginTop: '40px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
          </span>
          <span style={{ fontSize: '13px', color: '#9ca3af' }}>Servidores Operativos</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={16} style={{ color: '#9ca3af' }} />
          <span style={{ fontSize: '13px', color: '#9ca3af' }}>Conexión Segura</span>
        </div>
      </div>
    </div>
  );
}
