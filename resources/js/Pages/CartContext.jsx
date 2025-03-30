import React, { createContext, useState, useContext } from 'react';

// Buat Context
export const CartContext = createContext();

// Buat Provider Component
export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // Fungsi untuk mengupdate cart count
  const updateCartCount = (count) => {
    setCartCount(count);
  };

  // Value yang akan di-share
  const value = {
    cartCount,
    updateCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook untuk menggunakan cart context
export const useCart = () => {
  const context = useContext(CartContext);

  // Optional: Tambahkan error handling jika context tidak ditemukan
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};