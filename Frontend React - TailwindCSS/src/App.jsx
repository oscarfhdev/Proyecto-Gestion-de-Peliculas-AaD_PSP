import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPeliculasPage from './pages/AdminPeliculasPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Panel de Admin */}
        <Route path="/admin" element={<AdminPeliculasPage />} />

        {/* Cartelera (placeholder) */}
        <Route path="/cartelera" element={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-2xl">Cartelera</div>} />

        {/* Redirigir a login por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

