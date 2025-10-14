import axios from 'axios';
import type { Rol, RolResponse } from '../types/rol';

const BASE_URL = "http://localhost:8000/api/organization";

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    
    return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
};

export const rolService = {
    getRoles: async (): Promise<RolResponse> => {
        try {
            const { data } = await axios.get<Rol[]>(`${BASE_URL}/roles`, {
                headers: getAuthHeaders()
            });

            // El backend devuelve directamente el array de roles
            if (!Array.isArray(data)) {
                console.error('Respuesta inválida del servidor:', data);
                throw new Error('Formato de respuesta inválido');
            }

            // Transformamos la respuesta al formato esperado por el frontend
            return {
                roles: data.map(r => ({
                    id_rol: r.id_rol,
                    nombre: r.nombre
                })),
                total: data.length
            };
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error al obtener roles:', error.response.data);
                throw new Error(error.response.data.detail || 'Error al obtener roles');
            }
            throw error;
        }
    }
};