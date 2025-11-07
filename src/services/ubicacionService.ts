import axios from 'axios';
import type { UbicacionResponse } from '../types/ubicacion';

const BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/locations`;

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
            const { data } = await axios.get(`${BASE_URL}/ubicaciones`, {
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
            const { data } = await axios.get(`${BASE_URL}/sucursal/${id_sucursal}/ubicaciones`, {
                headers: getAuthHeaders()
            });
            
            // Si la respuesta es un array directamente
            if (Array.isArray(data)) {
                return {
                    ubicaciones: data,
                    total: data.length
                };
            }

            // Si ya viene en el formato esperado
            if (data && Array.isArray(data.ubicaciones)) {
                return data;
            }

            throw new Error('No se encontraron ubicaciones para esta sucursal');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const mensaje = error.response?.data?.detail || 'Error al obtener ubicaciones de la sucursal';
                throw new Error(mensaje);
            }
            throw error;
        }
    },

    createUbicacion: async (ubicacion: { nombre: string; codigo_ubicacion: string; tipo_ubicacion: string; id_sucursal: number }): Promise<void> => {
        try {
            await axios.post(`${BASE_URL}/crearUbicacion`, ubicacion, {
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