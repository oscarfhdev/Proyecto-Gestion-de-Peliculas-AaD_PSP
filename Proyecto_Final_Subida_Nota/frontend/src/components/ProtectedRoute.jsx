import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spin } from 'antd';

/**
 * Ruta protegida: redirige a /login si no está autenticado.
 * Si requiere un rol específico, redirige a / si no lo tiene.
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isAdmin, isUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0a0a0a]">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'ADMIN' && !isAdmin()) {
    return <Navigate to="/cartelera" replace />;
  }

  if (requiredRole === 'USER' && !isUser()) {
    return <Navigate to="/cartelera" replace />;
  }

  return children;
};

export default ProtectedRoute;
