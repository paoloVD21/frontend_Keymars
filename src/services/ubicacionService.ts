import axios from 'axios';
import type { UbicacionResponse } from '../types/ubicacion';

const BASE_URL = 'http://localhost:8000/api/ubicaciones';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    
    return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
};

export const ubicacionService = {
    getUbicaciones: async (): Promise<UbicacionResponse> => {
        try {
            const { data } = await axios.get(`${BASE_URL}/ListarUbicaciones`, {
                headers: getAuthHeaders()
            });
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.detail || 'Error al obtener ubicaciones');
            }
            throw error;
        }
    },

    getUbicacionesPorSucursal: async (id_sucursal: number): Promise<UbicacionResponse> => {
        try {
            const { data } = await axios.get(`${BASE_URL}/ListarUbicacionesPorSucursal/${id_sucursal}`, {
                headers: getAuthHeaders()
            });
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.detail || 'Error al obtener ubicaciones de la sucursal');
            }
            throw error;
        }
    },

    createUbicacion: async (ubicacion: { nombre: string; id_sucursal: number }): Promise<void> => {
        try {
            await axios.post(`${BASE_URL}/CrearUbicacion`, ubicacion, {
                headers: getAuthHeaders()
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.detail || 'Error al crear la ubicación');
            }
            throw error;
        }
    }
};