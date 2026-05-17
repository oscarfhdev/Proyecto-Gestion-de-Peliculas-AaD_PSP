import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import CarteleraPage from './pages/CarteleraPage';
import MisEntradasPage from './pages/MisEntradasPage';
import AdminPage from './pages/AdminPage';
import SesionesPage from './pages/SesionesPage';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Público */}
        <Route path="/login" element={<LoginPage />} />

        {/* Catálogo (público si quieres, pero lo dejamos tras login para coherencia con la tarea) */}
        <Route path="/cartelera" element={
          <ProtectedRoute>
            <CarteleraPage />
          </ProtectedRoute>
        } />

        {/* Sesiones de cine para comprar */}
        <Route path="/sesiones" element={
          <ProtectedRoute>
            <SesionesPage />
          </ProtectedRoute>
        } />

        {/* USER - Mis entradas */}
        <Route path="/mis-entradas" element={
          <ProtectedRoute requiredRole="USER">
            <MisEntradasPage />
          </ProtectedRoute>
        } />

        {/* ADMIN - Panel de administración */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminPage />
          </ProtectedRoute>
        } />

        {/* Redirect por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
