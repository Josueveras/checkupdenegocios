
import { useAuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  const context = useAuthContext();
  
  return {
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    loading: context.loading,
    login: context.login,
    logout: context.logout
  };
};

export const usePersistedAuth = () => {
  return useAuth(); // Agora a persistência está no contexto principal
};
