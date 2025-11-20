import axios from 'axios';
import type { Sucursal } from '../types/sucursal';

const BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/organization`;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    
    return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
};

export const sucursalService = {
    getSucursales: async (): Promise<{ sucursales: Sucursal[]; total: number }> => {
        try {
            const { data } = await axios.get<Sucursal[]>(`${BASE_URL}/sucursales`, {
                headers: getAuthHeaders()
            });
            
            // El backend devuelve directamente el array de sucursales
            if (!Array.isArray(data)) {
                throw new TypeError('Formato de respuesta inválido');
            }

            // Transformamos la respuesta al formato esperado por el frontend
            return {
                sucursales: data.map(s => ({
                    id_sucursal: s.id_sucursal,
                    nombre: s.nombre
                })),
                total: data.length
            };
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error al obtener sucursales:', error.response.data);
                throw new Error(error.response.data.detail || 'Error al obtener sucursales');
            }
            throw error;
        }
    }
};