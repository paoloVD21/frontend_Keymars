import axios from 'axios';
import type { SalidaCreate, SalidaResponse, HistorialSalidaResponse, MovimientoHistorialSalida } from '../types/salida';

const BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/movements`;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    
    return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
};

const extractUserIdFromToken = (): number => {
    const token = localStorage.getItem('token');
    if (!token) throw new TypeError('No token found');
    
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new TypeError('Token inválido');
    }

    try {
        const payload = JSON.parse(atob(parts[1]));
        
        if (!payload.sub) {
            throw new TypeError('ID de usuario no encontrado en el token');
        }
        
        const userId = Number.parseInt(payload.sub);
        if (Number.isNaN(userId)) {
            throw new TypeError('ID de usuario inválido en el token');
        }
        
        return userId;
    } catch (error) {
        if (error instanceof TypeError) {
            throw error;
        }
        throw new TypeError('Error al obtener el ID de usuario del token');
    }
};

const handleApiError = (error: unknown, defaultMessage: string): never => {
    if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.detail || defaultMessage);
    }
    
    if (error instanceof Error) {
        throw error;
    }
    
    throw new Error(defaultMessage);
};

export const salidaService = {
    getMotivosSalida: async (): Promise<string[]> => {
        try {
            const { data } = await axios.get<string[]>(
                `${BASE_URL}/motivos/salida`,
                { headers: getAuthHeaders() }
            );
            return data;
        } catch (error) {
            return handleApiError(error, 'Error al obtener motivos de salida');
        }
    },

    registrarSalida: async (salida: SalidaCreate): Promise<SalidaResponse> => {
        try {
            const userId = extractUserIdFromToken();
            
            const datosAEnviar = {
                ...salida,
                id_usuario: userId
            };

            const { data } = await axios.post<SalidaResponse>(
                `${BASE_URL}/registrarSalida`,
                datosAEnviar,
                { headers: getAuthHeaders() }
            );
            
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error de Axios:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    headers: error.response?.headers
                });
            }
            return handleApiError(error, 'Error al registrar salida');
        }
    },

    getHistorialMovimientos: async (fecha: string): Promise<HistorialSalidaResponse> => {
        try {
            const { data } = await axios.get(
                `${BASE_URL}/historial/salidas/${fecha}`,
                { headers: getAuthHeaders() }
            );

            if (Array.isArray(data)) {
                return { movimientos: data };
            }
            return data;
        } catch (error) {
            console.error('Error al obtener historial de salidas:', error);
            return handleApiError(error, 'Error al obtener el historial de salidas');
        }
    },

    getDetallesMovimiento: async (id: number): Promise<MovimientoHistorialSalida> => {
        try {
            const { data } = await axios.get<MovimientoHistorialSalida>(
                `${BASE_URL}/${id}`,
                { headers: getAuthHeaders() }
            );
            return data;
        } catch (error) {
            return handleApiError(error, 'Error al obtener detalles del movimiento');
        }
    },

    createSalida: async (salida: SalidaCreate): Promise<SalidaResponse> => {
        try {
            const { data } = await axios.post<SalidaResponse>(
                `${BASE_URL}/salidas`,
                salida,
                { headers: getAuthHeaders() }
            );
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error al crear salida:', error.response?.data);
            }
            return handleApiError(error, 'Error al crear salida');
        }
    }
};