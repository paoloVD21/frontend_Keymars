import axios from 'axios';
import type { SalidaCreate, SalidaResponse, HistorialSalidaResponse, MovimientoHistorialSalida } from '../types/salida';

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

export const salidaService = {
    getMotivosSalida: async (): Promise<string[]> => {
        try {
            const { data } = await axios.get<string[]>(
                `${BASE_URL}/motivos/salida`,
                {
                    headers: getAuthHeaders()
                }
            );
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.detail || 'Error al obtener motivos de salida');
            }
            throw error;
        }
    },

    registrarSalida: async (salida: SalidaCreate): Promise<SalidaResponse> => {
        try {
            const { data } = await axios.post<SalidaResponse>(
                `${BASE_URL}/registrarSalida`,
                salida,
                {
                    headers: getAuthHeaders()
                }
            );
            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                throw new Error(error.response.data.detail || 'Error al registrar salida');
            }
            throw new Error('Error al registrar salida');
        }
    },

    getHistorialMovimientos: async (fecha: string): Promise<HistorialSalidaResponse> => {
        try {
            const { data } = await axios.get<HistorialSalidaResponse>(
                `${BASE_URL}/historial/${fecha}`,
                {
                    headers: getAuthHeaders()
                }
            );
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.detail || 'Error al obtener historial de movimientos');
            }
            throw error;
        }
    },

    getDetallesMovimiento: async (id: number): Promise<MovimientoHistorialSalida> => {
        try {
            const { data } = await axios.get<MovimientoHistorialSalida>(
                `${BASE_URL}/${id}`,
                {
                    headers: getAuthHeaders()
                }
            );
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.detail || 'Error al obtener detalles del movimiento');
            }
            throw error;
        }
    },

    createSalida: async (salida: SalidaCreate): Promise<SalidaResponse> => {
        try {
            const { data } = await axios.post<SalidaResponse>(
                `${BASE_URL}/salidas`,
                salida,
                {
                    headers: getAuthHeaders()
                }
            );
            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                console.error('Error al crear salida:', error.response.data);
                throw new Error(error.response.data.detail || 'Error al crear salida');
            }
            throw new Error('Error al crear salida');
        }
    }
};