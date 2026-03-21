import { useAuthStore } from '../store';

export const useAuth = () => {
  return useAuthStore();
};
