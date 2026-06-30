import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Componente que protege rutas según el rol del usuario
interface ProtectedRouteProps {
  children: React.ReactNode;
  rol: 'super-admin' | 'admin'; // Rol requerido para acceder
}

export function ProtectedRoute({ children, rol }: ProtectedRouteProps) {
  const { usuario, isAuthenticated } = useAuth();

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol no coincide, redirige al login
  if (usuario?.rol !== rol) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado y tiene el rol correcto, muestra el contenido
  return <>{children}</>;
}
