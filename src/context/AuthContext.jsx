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
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('sigmaFxUser');
    const savedAdmin = localStorage.getItem('sigmaFxAdmin');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedAdmin) {
      setIsAdmin(JSON.parse(savedAdmin));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('sigmaFxUser', JSON.stringify(userData));
    
    // Check if admin
    if (userData.email === 'admin@sigmafx.com') {
      setIsAdmin(true);
      localStorage.setItem('sigmaFxAdmin', JSON.stringify(true));
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('sigmaFxUser');
    localStorage.removeItem('sigmaFxAdmin');
  };

  const value = {
    user,
    isAdmin,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};