import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPeliculasPage from './pages/AdminPeliculasPage';
import CarteleraPage from './pages/CarteleraPage';
import FavoritosPage from './pages/FavoritosPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Panel de Admin */}
        <Route path="/admin" element={<AdminPeliculasPage />} />

        {/* Cartelera (Vista Cliente) */}
        <Route path="/cartelera" element={<CarteleraPage />} />

        {/* Favoritos */}
        <Route path="/favoritos" element={<FavoritosPage />} />

        {/* Redirigir a login por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

