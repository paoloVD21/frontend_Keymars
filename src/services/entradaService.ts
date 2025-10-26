import axios from 'axios';
import type { Entrada, EntradaCreate, EntradaResponse } from '../types/entrada';

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
            const { data } = await axios.get<{ entradas: Entrada[] }>(
                `${BASE_URL}/entradas${fecha ? `?fecha=${fecha}` : ''}`,
                {
                    headers: getAuthHeaders()
                }
            );
            return {
                entradas: data.entradas || []
            };
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error al obtener entradas:', error.response.data);
                throw new Error(error.response.data.detail || 'Error al obtener entradas');
            }
            throw error;
        }
    },

    createEntrada: async (entrada: EntradaCreate): Promise<EntradaResponse> => {
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
            } catch (tokenError) {
                console.error('Error al decodificar el token:', tokenError);
                throw new Error('Error al obtener el ID de usuario del token');
            }

            const { data } = await axios.post<EntradaResponse>(
                `${BASE_URL}/registrarIngreso`,
                {
                    ...entrada,
                    id_usuario: userId
                },
                {
                    headers: getAuthHeaders()
                }
            );
            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                console.error('Error al crear entrada:', error.response.data);
                throw new Error(error.response.data.detail || 'Error al crear entrada');
            } else if (error instanceof Error) {
                throw error;
            } else {
                throw new Error('Error desconocido al crear entrada');
            }
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
                console.error('Error al obtener entrada:', error.response.data);
                throw new Error(error.response.data.detail || 'Error al obtener entrada');
            }
            throw error;
        }
    }
};