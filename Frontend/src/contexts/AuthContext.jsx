import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();



export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if(storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
    token,
    login,
    logout,
    register,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};