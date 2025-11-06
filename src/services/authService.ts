import axios from 'axios';
import type { AuthResponse, LoginCredentials } from '../types/auth';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth`;

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
            // Enviar tanto 'username' como 'email' para compatibilidad con distintos backends
            formData.append('username', credentials.email);
            formData.append('email', credentials.email);
            formData.append('password', credentials.password);

            const response = await axios.post(`${API_URL}/login`, formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });



            // Intentar extraer el token desde varias claves comunes
            const possibleTokenKeys = ['access_token', 'accessToken', 'token', 'auth_token', 'id_token'];
            let token: string | undefined = undefined;
            if (response.data && typeof response.data === 'object') {
                for (const key of possibleTokenKeys) {
                    if (response.data[key]) {
                        token = response.data[key];
                        break;
                    }
                }
                // Manejar respuestas anidadas: { data: { token: '...' } } o { result: { access_token: '...' } }
                if (!token) {
                    const nestedCandidates = ['data', 'result', 'payload'];
                    for (const nested of nestedCandidates) {
                        if (response.data[nested] && typeof response.data[nested] === 'object') {
                            for (const key of possibleTokenKeys) {
                                if (response.data[nested][key]) {
                                    token = response.data[nested][key];
                                    break;
                                }
                            }
                        }
                        if (token) break;
                    }
                }
                // También puede venir directamente como string (ej: response.data === '...')
                if (!token && typeof response.data === 'string') {
                    token = response.data as string;
                }
            }

            if (!token) {
                console.error('No se encontró token en la respuesta. Claves recibidas:', Object.keys(response.data || {}));
                // Lanzar error con detalle para que el UI pueda mostrarlo
                throw new Error('No se recibió token de acceso. Revisa la respuesta del servidor en la consola.');
            }
            
            // Guardar el token
            localStorage.setItem('token', token);

            // Convertir id_rol a string role
            const getRoleFromId = (id: number): 'supervisor' | 'asistente' => {
                if (id === 1) {
                    return 'supervisor';
                } else if (id === 2) {
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
            
            return authResponse;
        } catch (error) {
            console.error('Error durante el login:', error);
            if (axios.isAxiosError(error)) {
                // Detectar error de CORS
                if (error.code === 'ERR_NETWORK' && !error.response) {
                    console.error('Error de CORS detectado - El backend no permite peticiones desde este origen');
                    throw new Error('Error de conexión: El servidor no permite peticiones desde esta aplicación. Contacta al administrador.');
                }
                console.error('Detalles del error:', error.response?.data);
            }
            throw error;
        }
    },
    
    logout: async (): Promise<void> => {
        try {
            // Si tu backend tiene un endpoint de logout, llamarlo aquí
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Error during logout:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
};