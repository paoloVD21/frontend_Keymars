import axios from 'axios';
import type { Entrada, EntradaCreate, EntradaResponse, HistorialResponse, MovimientoHistorial } from '../types/entrada';

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

export const entradaService = {
    getEntradas: async (fecha?: string): Promise<{ entradas: Entrada[] }> => {
        try {
            const url = fecha ? `${BASE_URL}/historial/${fecha}` : `${BASE_URL}/entradas`;
            const { data } = await axios.get<{ entradas: Entrada[] }>(url, {
                headers: getAuthHeaders()
            });
            
            return { entradas: data.entradas || [] };
        } catch (error) {
            return handleApiError(error, `Error al obtener entradas${fecha ? ' para la fecha ' + fecha : ''}`);
        }
    },

    registrarIngreso: async (entrada: EntradaCreate): Promise<EntradaResponse> => {
        try {
            const userId = extractUserIdFromToken();
            
            const datosAEnviar = {
                ...entrada,
                id_usuario: userId
            };

            const { data } = await axios.post<EntradaResponse>(
                `${BASE_URL}/registrarIngreso`,
                datosAEnviar,
                { headers: getAuthHeaders() }
            );
            
            return data;
        } catch (error) {
            return handleApiError(error, 'Error al registrar ingreso');
        }
    },

    createEntrada: async (entrada: EntradaCreate): Promise<EntradaResponse> => {
        try {
            const { data } = await axios.post<EntradaResponse>(
                `${BASE_URL}/entradas`,
                entrada,
                { headers: getAuthHeaders() }
            );
            return data;
        } catch (error) {
            return handleApiError(error, 'Error al crear entrada');
        }
    },

    getEntradaPorId: async (id: number): Promise<EntradaResponse> => {
        try {
            const { data } = await axios.get<EntradaResponse>(
                `${BASE_URL}/entradas/${id}`,
                { headers: getAuthHeaders() }
            );
            return data;
        } catch (error) {
            return handleApiError(error, 'Error al obtener entrada');
        }
    },

    getHistorialMovimientos: async (fecha: string): Promise<HistorialResponse> => {
        try {
            const { data } = await axios.get(
                `${BASE_URL}/historial/entradas/${fecha}`,
                { headers: getAuthHeaders() }
            );

            if (Array.isArray(data)) {
                return { movimientos: data };
            }
            return data;
        } catch (error) {
            console.error('Error al obtener historial de entradas:', error);
            return handleApiError(error, 'Error al obtener el historial de entradas');
        }
    },

    getDetallesMovimiento: async (movimientoId: number): Promise<MovimientoHistorial> => {
        try {
            const { data } = await axios.get(
                `${BASE_URL}/${movimientoId}`,
                { headers: getAuthHeaders() }
            );
            return data;
        } catch (error) {
            return handleApiError(error, 'Error al obtener los detalles del movimiento');
        }
    }
};