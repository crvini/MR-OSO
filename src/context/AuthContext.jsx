import { useEffect, useState } from 'react';
import { AuthContext } from './auth-context';

const KEY = 'mroso_sesion';

const leerSesion = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null');
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  // Se guarda la sesion para que recargar la pagina no saque al usuario
  // en medio de una demostracion.
  const [user, setUser] = useState(leerSesion);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(KEY, JSON.stringify(user));
      else localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, [user]);

  const login = (username) => {
    setUser({
      nombre: username || 'Ana García',
      rol: 'Administrador',
      sucursal: 'Sucursal Centro',
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
