import axios from 'axios';
import type { Categoria } from '../types/categoria';

const BASE_URL = 'http://localhost:8000/api/categories';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    
    return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
};

export const categoriaService = {
    getCategorias: async () => {
        try {
            const { data } = await axios.get<{ categorias: Categoria[], total: number }>(
                `${BASE_URL}/ListarCategorias`,
                {
                    headers: getAuthHeaders()
                }
            );
            
            console.log('Respuesta del servidor (categorías):', data);
            
            const categoriasOrdenadas = data.categorias
                .map(categoria => ({
                    ...categoria
                }))
                .sort((a, b) => a.id_categoria - b.id_categoria);

            return {
                categorias: categoriasOrdenadas,
                total: data.total
            };
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error detallado:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                });
                throw new Error(error.response.data.detail || 'Error al obtener categorías');
            }
            throw error;
        }
    }
};