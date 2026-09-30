import { createContext, useContext, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('rim_user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('rim_token'));

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const payload = data.data;
    localStorage.setItem('rim_token', payload.token);
    localStorage.setItem('rim_user', JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
    return payload;
  };

  const registerAdmin = async (details) => {
    const { data } = await api.post('/auth/signup-admin', details);
    const payload = data.data;
    localStorage.setItem('rim_token', payload.token);
    localStorage.setItem('rim_user', JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
    return payload;
  };

  const logout = () => {
    localStorage.removeItem('rim_token');
    localStorage.removeItem('rim_user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      registerAdmin,
      logout,
      isAuthenticated: !!token,
    }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
