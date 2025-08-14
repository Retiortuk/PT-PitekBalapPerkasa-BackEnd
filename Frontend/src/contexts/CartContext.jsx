import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { toast } from '@/components/ui/use-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orderType, setOrderType] = useState('ekor'); // 'ekor' or 'kg'
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } else {
      setCartItems([]);
    }
  }, [user]);

  const saveCart = (items) => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(items));
    }
  };

  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    let newItems;
    
    if (product.stock < 1) {
      toast({
        title: "Stok Habis",
        description: "Maaf, stok untuk produk ini sudah habis.",
        variant: "destructive",
      });
      return;
    }

    if (existingItem) {
      newItems = cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Add sellingMethod to the product when adding to cart
      const productWithMethod = { ...product, sellingMethod: product.sellingMethod || 'kg' };
      newItems = [...cartItems, { ...productWithMethod, quantity }];
    }

    setCartItems(newItems);
    saveCart(newItems);
  };

  const removeFromCart = (productId) => {
    const newItems = cartItems.filter(item => item.id !== productId);
    setCartItems(newItems);
    saveCart(newItems);
  };

  const updateQuantity = (productId, quantity, orderType) => {
    const item = cartItems.find(i => i.id === productId);
    
    if (orderType === 'ekor' && quantity > item.stock) {
      toast({
        title: "Stok Tidak Cukup",
        description: `Maksimal pemesanan adalah ${item.stock} ekor.`,
        variant: "destructive",
      });
      quantity = item.stock;
    }
    
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    const newItems = cartItems.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCartItems(newItems);
    saveCart(newItems);
  };

  const clearCart = () => {
    setCartItems([]);
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
        // Price is always per kg, quantity is either ekor or kg
        if (item.sellingMethod === 'ekor') {
            const avgWeight = parseFloat(item.weight.split('-')[0]) || 1;
            return total + (item.price * avgWeight * item.quantity);
        }
        // Default to kg based calculation
        return total + (item.price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    orderType,
    setOrderType,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};