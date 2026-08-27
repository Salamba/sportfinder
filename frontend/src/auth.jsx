import { createContext, useContext, useState, useEffect } from 'react';
import { api } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sf_token');
    if (token) {
      api.me()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('sf_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Попытка входа:', email);
      const data = await api.login({ email, password });
      console.log('✅ Ответ от сервера:', data);
      
      // Проверяем, что данные пришли
      if (!data || !data.token) {
        throw new Error('Не получен токен авторизации');
      }
      
      localStorage.setItem('sf_token', data.token);
      console.log('🔑 Токен сохранен');
      
      const userData = await api.me();
      console.log('👤 Данные пользователя:', userData);
      
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('❌ Ошибка входа:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('sf_token');
    setUser(null);
  };

  const value = { user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}