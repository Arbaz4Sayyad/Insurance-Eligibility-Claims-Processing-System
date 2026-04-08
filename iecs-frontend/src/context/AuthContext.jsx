import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('iecs-token');
    if (token) {
      try {
        // In simulation, jwt-decode might fail on mock tokens, so we wrap it
        let decoded;
        if (token.startsWith('mock-jwt-')) {
          const suffix = token.replace('mock-jwt-', '').toLowerCase();
          // Map 'worker' suffix to CASEWORKER role
          const role = suffix === 'worker' ? 'CASEWORKER' : suffix.toUpperCase();
          decoded = { role };
        } else {
          decoded = jwtDecode(token);
        }
        setUser({ ...decoded, token });
      } catch (e) {
        localStorage.removeItem('iecs-token');
      }
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    localStorage.setItem('iecs-token', data.token);
    setUser({ ...data.user, role: data.role, token: data.token });
    
    // Redirect based on role
    switch (data.role) {
      case 'ADMIN': navigate('/admin'); break;
      case 'CASEWORKER': navigate('/caseworker'); break;
      case 'CITIZEN': navigate('/dashboard'); break;
      default: navigate('/');
    }
  };

  const logout = () => {
    localStorage.removeItem('iecs-token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
