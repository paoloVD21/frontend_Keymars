import { createContext } from 'react';
import type { AuthResponse } from '../types/auth';

export interface AuthContextType {
  user: AuthResponse['user'] | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);