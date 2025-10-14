import axios from 'axios';
import type { AuthResponse, LoginCredentials } from '../types/auth';

const API_URL = 'http://localhost:8000/api/auth';

export const authService = {
    getCurrentUser: async (): Promise<AuthResponse> => {
        console.log("📡 Iniciando getCurrentUser");
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("❌ No se encontró token en localStorage");
            throw new Error('No token found');
        }

        try {
            console.log("🔄 Realizando petición a /session");
            const response = await axios.get(`${API_URL}/session`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            console.log("✅ Respuesta del backend:", response.data);

            // Verificar si la sesión está activa
            if (!response.data.activa) {
                console.error("❌ Sesión no activa");
                throw new Error('Sesión no activa');
            }

            // Obtener la información del usuario almacenada
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                console.error("❌ No se encontró información del usuario");
                throw new Error('No user information found');
            }

            const user = JSON.parse(storedUser);
            const userData = {
                user: {
                    email: user.email,
                    role: user.role,
                    nombre: user.nombre || '',
                    apellido: user.apellido || ''
                },
                token
            };

            console.log("✅ Datos de usuario procesados:", {
                ...userData,
                token: "OCULTO"
            });
            return userData;

        } catch (error) {
            console.error("❌ Error en getCurrentUser:", error);
            if (axios.isAxiosError(error)) {
                console.error("Detalles del error:", {
                    status: error.response?.status,
                    data: error.response?.data
                });
            }
            localStorage.removeItem('token');
            throw error;
        }
    },
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
            const getRoleFromId = (id: number): 'supervisor' | 'asistente' => {
                if (id === 1) {
                    return 'supervisor';
                } else if (id === 0) {
                    return 'asistente';
                } else {
                    console.warn(`ID de rol no reconocido: ${id}, asignando rol por defecto 'asistente'`);
                    return 'asistente';
                }
            };

            const user = {
                email: credentials.email,
                role: getRoleFromId(response.data.user?.id_rol),
                nombre: response.data.user?.nombre || '',
                apellido: response.data.user?.apellido || ''
            };

            // Guardar la información del usuario
            localStorage.setItem('user', JSON.stringify(user));

            // Adaptar la respuesta al formato que espera nuestra aplicación
            const authResponse: AuthResponse = {
                user,
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