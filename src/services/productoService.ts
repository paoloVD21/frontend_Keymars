import axios from 'axios';
import type { Producto, ProductoUpdate, GetProductosParams } from '../types/producto';

const API_URL = import.meta.env.VITE_API_URL;

export const productoService = {
    getProductos: async (params?: GetProductosParams): Promise<{ productos: Producto[], total: number }> => {
        const response = await axios.get(`${API_URL}/productos`, { params });
        return response.data;
    },

    getProductoById: async (id: number): Promise<Producto> => {
        const response = await axios.get(`${API_URL}/productos/${id}`);
        return response.data;
    },

    createProducto: async (producto: ProductoUpdate): Promise<Producto> => {
        const response = await axios.post(`${API_URL}/productos`, producto);
        return response.data;
    },

    updateProducto: async (id: number, producto: ProductoUpdate): Promise<Producto> => {
        const response = await axios.put(`${API_URL}/productos/${id}`, producto);
        return response.data;
    },

    toggleProductoStatus: async (id: number): Promise<Producto> => {
        const response = await axios.patch(`${API_URL}/productos/${id}/toggle-status`);
        return response.data;
    },
};