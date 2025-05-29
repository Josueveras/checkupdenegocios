
import { useAuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  return useAuthContext();
};

export const usePersistedAuth = () => {
  // Agora usamos apenas o contexto, pois o Supabase já gerencia a persistência
  return useAuthContext();
};
