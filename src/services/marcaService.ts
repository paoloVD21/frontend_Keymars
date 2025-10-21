import axios from 'axios';
import type { Marca } from '../types/marca';

const BASE_URL = 'http://localhost:8000/api/brands';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    
    return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
};

export const marcaService = {
    getMarcas: async () => {
        try {
            const response = await axios.get<Marca[]>(
                `${BASE_URL}/listarMarcas`,
                {
                    headers: getAuthHeaders()
                }
            );
            
            console.log('Respuesta del servidor (marcas):', response.data);
            
            // Asumimos que el backend devuelve directamente el array de marcas
            const marcasOrdenadas = (response.data || [])
                .map(marca => ({
                    ...marca
                }))
                .sort((a, b) => a.id_marca - b.id_marca);

            return {
                marcas: marcasOrdenadas,
                total: marcasOrdenadas.length
            };
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error detallado:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                });
                throw new Error(error.response.data.detail || 'Error al obtener marcas');
            }
            throw error;
        }
    }
};