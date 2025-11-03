import axios from 'axios';
import type { Entrada, EntradaCreate, EntradaResponse, HistorialResponse, MovimientoHistorial } from '../types/entrada';

const BASE_URL = "http://localhost:8000/api/movements";

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    
    return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
};

export const entradaService = {
    getEntradas: async (fecha?: string): Promise<{ entradas: Entrada[] }> => {
        try {
            const url = fecha ? `${BASE_URL}/historial/${fecha}` : `${BASE_URL}/entradas`;
            const { data } = await axios.get<{ entradas: Entrada[] }>(
                url,
                {
                    headers: getAuthHeaders()
                }
            );
            
            return {
                entradas: data.entradas || []
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.detail || `Error al obtener entradas${fecha ? ' para la fecha ' + fecha : ''}`);
            }
            throw error;
        }
    },

    registrarIngreso: async (entrada: EntradaCreate): Promise<EntradaResponse> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');
            
            // Extraer el ID del usuario del token
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Token inválido');
            }

            let userId: number;
            try {
                const payload = JSON.parse(atob(parts[1]));
                
                if (!payload.sub) {
                    throw new Error('ID de usuario no encontrado en el token');
                }
                userId = parseInt(payload.sub);
                if (isNaN(userId)) {
                    throw new Error('ID de usuario inválido en el token');
                }
            } catch {
                throw new Error('Error al obtener el ID de usuario del token');
            }

            const datosAEnviar = {
                ...entrada,
                id_usuario: userId
            };

            const { data } = await axios.post<EntradaResponse>(
                `${BASE_URL}/registrarIngreso`,
                datosAEnviar,
                {
                    headers: getAuthHeaders()
                }
            );
            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                throw new Error(error.response.data.detail || 'Error al crear entrada');
            } else if (error instanceof Error) {
                throw error;
            } else {
                throw new Error('Error desconocido al crear entrada');
            }
        }
    },

    createEntrada: async (entrada: EntradaCreate): Promise<EntradaResponse> => {
        try {
            const { data } = await axios.post<EntradaResponse>(
                `${BASE_URL}/entradas`,
                entrada,
                {
                    headers: getAuthHeaders()
                }
            );
            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                throw new Error(error.response.data.detail || 'Error al crear entrada');
            }
            throw new Error('Error al crear entrada');
        }
    },

    getEntradaPorId: async (id: number): Promise<EntradaResponse> => {
        try {
            const { data } = await axios.get<EntradaResponse>(
                `${BASE_URL}/entradas/${id}`,
                {
                    headers: getAuthHeaders()
                }
            );
            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.detail || 'Error al obtener entrada');
            }
            throw error;
        }
    },

    getHistorialMovimientos: async (fecha: string): Promise<HistorialResponse> => {
        try {
            const { data } = await axios.get(
                `${BASE_URL}/historial/entradas/${fecha}`,
                {
                    headers: getAuthHeaders()
                }
            );

            // Formatear la respuesta según su estructura
            if (Array.isArray(data)) {
                return {
                    movimientos: data
                };
            }
            return data;
        } catch (error) {
            console.error('Error al obtener historial de entradas:', error);
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.detail || 'Error al obtener el historial de entradas');
            }
            throw error;
        }
    },

    getDetallesMovimiento: async (movimientoId: number): Promise<MovimientoHistorial> => {
        try {
            const { data } = await axios.get(
                `${BASE_URL}/${movimientoId}`,
                {
                    headers: getAuthHeaders()
                }
            );
            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.detail || 'Error al obtener los detalles del movimiento');
            }
            throw error;
        }
    }
};