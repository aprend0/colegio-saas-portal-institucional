import { createContext, useContext, useState, ReactNode } from 'react';

// Tipos de usuario del sistema
interface Usuario {
  token: string;
  rol: 'super-admin' | 'admin';
  colegioId?: number;
  nombre?: string;
}

// Tipos del contexto de autenticación
interface AuthContextType {
  usuario: Usuario | null;
  login: (datos: Usuario) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Crear el contexto de autenticación
const AuthContext = createContext<AuthContextType | null>(null);

// Proveedor del contexto — envuelve toda la aplicación
export function AuthProvider({ children }: { children: ReactNode }) {
  // Estado del usuario autenticado
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    // Recuperar usuario guardado en localStorage al iniciar
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol') as 'super-admin' | 'admin';
    const colegioId = localStorage.getItem('colegioId');
    const nombre = localStorage.getItem('nombre');
    if (token && rol) {
      return { token, rol, colegioId: colegioId ? Number(colegioId) : undefined, nombre: nombre || undefined };
    }
    return null;
  });

  // Función para iniciar sesión
  const login = (datos: Usuario) => {
    setUsuario(datos);
    // Guardar datos en localStorage para persistir la sesión
    localStorage.setItem('token', datos.token);
    localStorage.setItem('rol', datos.rol);
    if (datos.colegioId) localStorage.setItem('colegioId', String(datos.colegioId));
    if (datos.nombre) localStorage.setItem('nombre', datos.nombre);
  };

  // Función para cerrar sesión
  const logout = () => {
    setUsuario(null);
    // Limpiar localStorage al cerrar sesión
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('colegioId');
    localStorage.removeItem('nombre');
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isAuthenticated: !!usuario }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}