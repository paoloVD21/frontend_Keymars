import axios from 'axios';

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

export interface ProductoBusqueda {
    id_producto: number;
    nombre_producto: string;
    codigo_producto: string;
    precio: number;
    stock_ubicaciones: {
        id_ubicacion: number;
        nombre_ubicacion: string;
        stock_actual: number;
    }[];
}

export const movimientoService = {
    buscarProductos: async (idSucursal: number, buscar: string): Promise<ProductoBusqueda[]> => {
        try {
            const { data } = await axios.get<ProductoBusqueda[]>(
                `${BASE_URL}/productos/buscar/${idSucursal}?buscar=${encodeURIComponent(buscar)}`,
                {
                    headers: getAuthHeaders()
                }
            );
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.detail || 'Error al buscar productos');
            }
            throw error;
        }
    },

    buscarProductosEntrada: async (idSucursal: number, buscar: string): Promise<ProductoBusqueda[]> => {
        try {
            const { data } = await axios.get<ProductoBusqueda[]>(
                `${BASE_URL}/productos/entrada/${idSucursal}?buscar=${encodeURIComponent(buscar)}`,
                {
                    headers: getAuthHeaders()
                }
            );
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.detail || 'Error al buscar productos');
            }
            throw error;
        }
    }
};