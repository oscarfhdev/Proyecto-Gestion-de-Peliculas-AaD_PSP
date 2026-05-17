import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Añadir función al carrito
  const addItem = (funcion) => {
    // Evitar duplicados
    if (items.some(item => item.id === funcion.id)) return false;
    setItems(prev => [...prev, { ...funcion, cantidad: 1 }]);
    return true;
  };

  // Eliminar del carrito
  const removeItem = (funcionId) => {
    setItems(prev => prev.filter(item => item.id !== funcionId));
  };

  // Vaciar carrito
  const clearCart = () => setItems([]);

  // Total
  const getTotal = () => items.reduce((sum, item) => sum + (item.precio || 0) * item.cantidad, 0);

  // Contar items
  const getCount = () => items.length;

  // Comprobar si está en el carrito
  const isInCart = (funcionId) => items.some(item => item.id === funcionId);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, getTotal, getCount, isInCart }}>
      {children}
    </CartContext.Provider>
  );
};
