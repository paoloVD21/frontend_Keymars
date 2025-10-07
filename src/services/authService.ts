import axios from 'axios';
import type { AuthResponse, LoginCredentials } from '../types/auth';

const API_URL = 'http://localhost:8000/api/auth';

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        try {
            console.log('Intentando login con credenciales:', { email: credentials.email });
            
            // Crear FormData con el formato correcto
            const formData = new URLSearchParams();
            formData.append('username', credentials.email);
            formData.append('password', credentials.password);

            console.log('Enviando petición al backend...');
            const response = await axios.post(`${API_URL}/login`, formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            console.log('Respuesta del backend:', response.data);

            // Asumiendo que el backend devuelve { access_token, user }
            const token = response.data.access_token;
            if (!token) {
                console.error('No se recibió token en la respuesta');
                throw new Error('No se recibió token de acceso');
            }
            
            // Guardar el token
            localStorage.setItem('token', token);

            // Convertir id_rol a string role
            const getRoleFromId = (id: number): 'Supervisor' | 'Asistente' => {
                switch (id) {
                    case 1:
                        return 'Supervisor';
                    default:
                        return 'Asistente';
                }
            };

            // Adaptar la respuesta al formato que espera nuestra aplicación
            const authResponse = {
                user: {
                    email: credentials.email,
                    role: getRoleFromId(response.data.user?.id_rol)
                },
                token
            };
            
            console.log('Respuesta procesada:', authResponse);
            return authResponse;
        } catch (error) {
            console.error('Error durante el login:', error);
            if (axios.isAxiosError(error)) {
                console.error('Detalles del error:', error.response?.data);
            }
            throw error;
        }
    },
    
    logout: async (): Promise<void> => {
        try {
            // Si tu backend tiene un endpoint de logout, llamarlo aquí
            localStorage.removeItem('token');
        } catch (error) {
            console.error('Error during logout:', error);
            localStorage.removeItem('token');
        }
    }
};