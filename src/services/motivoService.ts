import axios from 'axios';
import type { Motivo } from '../types/motivo';

const BASE_URL = 'http://localhost:8000/api/movements';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    
    return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
};

export const motivoService = {
    getMotivosEntrada: async (): Promise<Motivo[]> => {
        try {
            const { data } = await axios.get<Motivo[]>(
                `${BASE_URL}/motivos/entrada`,
                {
                    headers: getAuthHeaders()
                }
            );
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.detail || 'Error al obtener motivos de entrada');
            }
            throw error;
        }
    },

    getMotivosSalida: async (): Promise<Motivo[]> => {
        try {
            const { data } = await axios.get<Motivo[]>(
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
    }
};