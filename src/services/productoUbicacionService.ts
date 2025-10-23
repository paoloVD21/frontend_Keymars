import axios from 'axios';
import type { ProductoUbicacionResponse } from '../types/productoUbicacion';

const BASE_URL = 'http://localhost:8000/api/products/ubicaciones';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    
    return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
};

export const productoUbicacionService = {
    getUbicacionesProducto: async (id_producto: number): Promise<ProductoUbicacionResponse> => {
        try {
            const { data } = await axios.get(`${BASE_URL}/ListarUbicacionesProducto/${id_producto}`, {
                headers: getAuthHeaders()
            });
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.detail || 'Error al obtener ubicaciones del producto');
            }
            throw error;
        }
    }
};