import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
          
          try {
            const response = await authAPI.getProfile();
            const prof = response.data;
            if (prof.avatar && prof.avatar.startsWith('/')) {
              prof.avatar = `${window.location.origin}${prof.avatar}`;
            }
            setUser(prof);
          } catch (error) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { user: userData, token } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.non_field_errors?.[0] || 
                          error.response?.data?.message || 
                          'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { user: newUser, token } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error);
      const errorData = error.response?.data;
      let errorMessage = 'Registration failed';
      
      if (errorData) {
        const fieldErrors = [];
        Object.keys(errorData).forEach(field => {
          if (Array.isArray(errorData[field])) {
            fieldErrors.push(`${field}: ${errorData[field][0]}`);
          }
        });
        if (fieldErrors.length > 0) {
          errorMessage = fieldErrors.join(', ');
        }
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (userData) => {
    try {
      let payload = userData;
      if (userData && userData.avatarFile) {
        const form = new FormData();
        Object.entries(userData).forEach(([k, v]) => {
          if (k === 'avatarFile') return;
            if (v !== undefined && v !== null) form.append(k, v);
        });
        form.append('avatar', userData.avatarFile);
        payload = form;
      }
      const response = await authAPI.updateProfile(payload);
      const updatedUser = response.data;
      if (updatedUser.avatar && updatedUser.avatar.startsWith('/')) {
        updatedUser.avatar = `${window.location.origin}${updatedUser.avatar}`;
      }
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      const data = error.response?.data;
      let errorMessage = 'Profile update failed';
      if (data) {
        if (typeof data === 'object') {
          const parts = [];
            Object.entries(data).forEach(([k,v]) => {
              if (Array.isArray(v)) parts.push(`${k}: ${v[0]}`);
              else if (typeof v === 'string') parts.push(`${k}: ${v}`);
            });
          if (parts.length) errorMessage = parts.join(', ');
        }
      }
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
