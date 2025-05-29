
import { useAuthContext } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export const useAuth = () => {
  return useAuthContext();
};

export const usePersistedAuth = () => {
  const { user, login, logout } = useAuthContext();
  const [persistedUser, setPersistedUser] = useState<any>(null);

  useEffect(() => {
    // Verificar se existe usuário no localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser && !user) {
      const parsedUser = JSON.parse(savedUser);
      setPersistedUser(parsedUser);
    }
  }, [user]);

  return {
    user: user || persistedUser,
    isAuthenticated: !!(user || persistedUser),
    login,
    logout
  };
};
