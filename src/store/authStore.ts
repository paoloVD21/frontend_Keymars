import { create } from 'zustand';
import type { User } from '../types/auth';
import { authService } from '../services/authService';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
    // Función para inicializar el store
    const initializeStore = async () => {
        set({ isLoading: true }); // Establecer loading al inicio
        
        const token = localStorage.getItem('token');
        
        if (!token) {
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            });
            return;
        }

        try {
            const response = await authService.getCurrentUser();
            
            set({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
        } catch (error) {
            console.error('❌ Error al inicializar la sesión:', error);
            localStorage.removeItem('token');
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            });
        }
    };

    // Inicializar el store inmediatamente
    initializeStore();

    return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

    login: async (email: string, password: string) => {
        try {
            set({ isLoading: true, error: null });
            const response = await authService.login({ email, password });
            
            // Guardar el token en localStorage
            localStorage.setItem('token', response.token);
            
            set({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
        } catch (error) {
            set({
                isLoading: false,
                error: 'Error al iniciar sesión. Por favor, verifica tus credenciales.'
            });
            throw error;
        }
    },

    logout: async () => {
        try {
            await authService.logout();
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                error: null
            });
        } catch (error) {
            set({
                error: 'Error al cerrar sesión.'
            });
            throw error;
        }
    }
}});