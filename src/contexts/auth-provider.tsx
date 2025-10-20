import { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import type { AuthResponse } from '../types/auth';
import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log('Intentando cargar usuario...');
        const userData = await authService.getCurrentUser();
        console.log('Usuario cargado:', userData);
        setUser(userData.user);
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};