import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas futuras (placeholder) */}
        <Route path="/admin" element={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-2xl">Panel de Administrador</div>} />
        <Route path="/cartelera" element={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-2xl">Cartelera</div>} />

        {/* Redirigir a login por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
