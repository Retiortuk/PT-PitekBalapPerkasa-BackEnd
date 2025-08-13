import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Also clear associated cart for safety
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    }
  };

  const updateUser = (updatedData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u => u.id === updatedData.id ? updatedData : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    setUser(updatedData);
    localStorage.setItem('user', JSON.stringify(updatedData));
  };

  const register = (userData) => {
    const newUser = {
      ...userData,
      id: `user_${Date.now()}`,
      role: userData.role || 'user',
      createdAt: new Date().toISOString(),
      isVerified: false,
      verificationDoc: null,
      verificationStatus: 'not_submitted', // not_submitted, pending, approved, rejected
      bankInfo: { bankName: '', accountNumber: '', accountName: '' }
    };
    
    // Save to localStorage users list
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    login(newUser);
    return newUser;
  };

  const value = {
    user,
    login,
    logout,
    register,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};