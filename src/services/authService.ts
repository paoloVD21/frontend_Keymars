import axios from 'axios';
import type { AuthResponse, LoginCredentials } from '../types/auth';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth`;

const extractTokenFromResponse = (responseData: any): string => {
    const possibleTokenKeys = ['access_token', 'accessToken', 'token', 'auth_token', 'id_token'];
    
    // Intenta encontrar el token en las claves principales
    if (responseData && typeof responseData === 'object') {
        for (const key of possibleTokenKeys) {
            if (responseData[key]) {
                return responseData[key];
            }
        }
        
        // Intenta buscar en objetos anidados
        const nestedCandidates = ['data', 'result', 'payload'];
        for (const nested of nestedCandidates) {
            if (responseData[nested] && typeof responseData[nested] === 'object') {
                for (const key of possibleTokenKeys) {
                    if (responseData[nested][key]) {
                        return responseData[nested][key];
                    }
                }
            }
        }
        
        // Si viene directamente como string
        if (typeof responseData === 'string') {
            return responseData;
        }
    }
    
    throw new Error('No se recibió token de acceso. Revisa la respuesta del servidor en la consola.');
};

const getRoleFromId = (id: number): 'supervisor' | 'asistente' => {
    if (id === 1) {
        return 'supervisor';
    } else if (id === 2) {
        return 'asistente';
    }
    console.warn(`ID de rol no reconocido: ${id}, asignando rol por defecto 'asistente'`);
    return 'asistente';
};

const handleLoginError = (error: any): never => {
    console.error('Error durante el login:', error);
    if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_NETWORK' && !error.response) {
            throw new Error('Error de conexión: El servidor no permite peticiones desde esta aplicación. Contacta al administrador.');
        }
        console.error('Detalles del error:', error.response?.data);
    }
    throw error;
};

export const authService = {
    getCurrentUser: async (): Promise<AuthResponse> => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        try {
            const response = await axios.get(`${API_URL}/session`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            // Verificar si la sesión está activa
            if (!response.data.activa) {
                throw new Error('Sesión no activa');
            }

            // Obtener la información del usuario almacenada
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
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
            // Crear FormData con el formato correcto
            const formData = new URLSearchParams();
            formData.append('username', credentials.email);
            formData.append('email', credentials.email);
            formData.append('password', credentials.password);

            const response = await axios.post(`${API_URL}/login`, formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            // Extraer token
            const token = extractTokenFromResponse(response.data);
            localStorage.setItem('token', token);

            // Crear objeto de usuario
            const user = {
                email: credentials.email,
                role: getRoleFromId(response.data.user?.id_rol),
                nombre: response.data.user?.nombre || '',
                apellido: response.data.user?.apellido || ''
            };

            localStorage.setItem('user', JSON.stringify(user));

            return {
                user,
                token
            };
        } catch (error) {
            handleLoginError(error);
        }
    },
    
    logout: async (): Promise<void> => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Error during logout:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
};