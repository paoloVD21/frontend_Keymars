import axios from 'axios';
import type { AuthResponse, LoginCredentials } from '../types/auth';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth`;

interface TokenResponse {
    [key: string]: string;
}

interface LoginResponse {
    access_token?: string;
    accessToken?: string;
    token?: string;
    auth_token?: string;
    id_token?: string;
    data?: TokenResponse;
    result?: TokenResponse;
    payload?: TokenResponse;
    user?: {
        id_rol?: number;
        nombre?: string;
        apellido?: string;
    };
}

const POSSIBLE_TOKEN_KEYS = ['access_token', 'accessToken', 'token', 'auth_token', 'id_token'];
const NESTED_CANDIDATES = ['data', 'result', 'payload'];

const findTokenInObject = (obj: TokenResponse, keys: string[]): string | null => {
    for (const key of keys) {
        if (obj[key]) {
            return obj[key];
        }
    }
    return null;
};

const extractTokenFromTopLevel = (responseData: LoginResponse): string | null => {
    return findTokenInObject(responseData as TokenResponse, POSSIBLE_TOKEN_KEYS);
};

const extractTokenFromNested = (responseData: LoginResponse): string | null => {
    for (const nested of NESTED_CANDIDATES) {
        const nestedData = responseData[nested as keyof LoginResponse];
        if (nestedData && typeof nestedData === 'object') {
            const token = findTokenInObject(nestedData as TokenResponse, POSSIBLE_TOKEN_KEYS);
            if (token) {
                return token;
            }
        }
    }
    return null;
};

const extractTokenFromResponse = (responseData: LoginResponse): string => {
    if (!responseData || typeof responseData !== 'object') {
        throw new TypeError('La respuesta del servidor no es un objeto válido');
    }

    const token = extractTokenFromTopLevel(responseData) || extractTokenFromNested(responseData);
    
    if (token && typeof token === 'string') {
        return token;
    }

    throw new Error('No se recibió token de acceso. Revisa la respuesta del servidor en la consola.');
};

const ROLE_MAP: Record<number, 'supervisor' | 'asistente'> = {
    1: 'supervisor',
    2: 'asistente'
};

const DEFAULT_ROLE = 'asistente' as const;

const getRoleFromId = (id: number): 'supervisor' | 'asistente' => {
    const role = ROLE_MAP[id];
    if (!role) {
        console.warn(`ID de rol no reconocido: ${id}, asignando rol por defecto '${DEFAULT_ROLE}'`);
        return DEFAULT_ROLE;
    }
    return role;
};

const validateSessionResponse = (response: { data?: { activa?: boolean } }): void => {
    if (!response?.data?.activa) {
        throw new Error('Sesión no activa');
    }
};

const buildUserData = (storedUserJson: string, token: string): AuthResponse => {
    const user = JSON.parse(storedUserJson);
    return {
        user: {
            email: user.email,
            role: user.role,
            nombre: user.nombre || '',
            apellido: user.apellido || ''
        },
        token
    };
};

const getStoredUser = (): string => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
        throw new Error('No user information found');
    }
    return storedUser;
};

const createLoginFormData = (credentials: LoginCredentials): URLSearchParams => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('email', credentials.email);
    formData.append('password', credentials.password);
    return formData;
};

const createUserFromLoginResponse = (credentials: LoginCredentials, responseData: LoginResponse) => {
    return {
        email: credentials.email,
        role: getRoleFromId(responseData.user?.id_rol ?? 2),
        nombre: responseData.user?.nombre || '',
        apellido: responseData.user?.apellido || ''
    };
};

const storeAuthData = (token: string, user: Record<string, unknown>): void => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
};

const handleLoginError = (error: unknown): never => {
    if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK' && !error.response) {
        throw new Error('Error de conexión: El servidor no permite peticiones desde esta aplicación. Contacta al administrador.');
    }
    
    console.error('Error durante el login:', error);
    if (axios.isAxiosError(error)) {
        console.error('Detalles del error:', error.response?.data);
    }
    throw error;
};

const handleGetCurrentUserError = (error: unknown): never => {
    console.error("❌ Error en getCurrentUser:", error);
    if (axios.isAxiosError(error)) {
        console.error("Detalles del error:", {
            status: error.response?.status,
            data: error.response?.data
        });
    }
    localStorage.removeItem('token');
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

            validateSessionResponse(response);
            const storedUser = getStoredUser();
            return buildUserData(storedUser, token);

        } catch (error) {
            return handleGetCurrentUserError(error);
        }
    },
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        try {
            const formData = createLoginFormData(credentials);

            const response = await axios.post(`${API_URL}/login`, formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const token = extractTokenFromResponse(response.data);
            const user = createUserFromLoginResponse(credentials, response.data);
            
            storeAuthData(token, user);

            return { user, token };
        } catch (error) {
            return handleLoginError(error);
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