import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import { tokenStorage } from '../utils/tokenStorage';

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

  // Check if user is logged in on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (tokenStorage.hasToken()) {
          // Try to get current user with token
          const userData = await authAPI.getCurrentUser();
          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        tokenStorage.removeToken();
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { token, user: userData } = response;
      
      // Store token in localStorage
      tokenStorage.setToken(token);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.userMessage || 'Login failed. Please try again.' 
      };
    }
  };

  const logout = async () => {
    tokenStorage.removeToken();
    setUser(null);
  };

  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register(name, email, password);
      const { token, user: userData } = response;
      
      // Store token in localStorage
      tokenStorage.setToken(token);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error.userMessage || 'Registration failed. Please try again.' 
      };
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};