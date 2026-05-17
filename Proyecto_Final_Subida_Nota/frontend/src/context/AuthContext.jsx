import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al montar, comprobar si hay token guardado
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/v1/auth/login', { email, password });
    const { accessToken, refreshToken, roles, email: userEmail, nombre, message } = res.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    const userData = { email: userEmail, nombre, roles: Array.from(roles) };
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    return message;
  };

  const register = async (email, password, nombre) => {
    const res = await api.post('/api/v1/auth/register', { email, password, nombre });
    const { accessToken, refreshToken, roles, email: userEmail, nombre: userNombre, message } = res.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    const userData = { email: userEmail, nombre: userNombre, roles: Array.from(roles) };
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    return message;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const isAdmin = () => user?.roles?.includes('ADMIN');
  const isUser = () => user?.roles?.includes('USER');
  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, isUser, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
