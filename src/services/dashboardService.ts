import axios from 'axios';
import type { DashboardStats, DashboardMovimientos, DashboardDistribucion } from '../types/dashboard';

const BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/dashboard`;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    
    return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
};

export const dashboardService = {
    getStats: async (): Promise<DashboardStats> => {
        try {
            const { data } = await axios.get(`${BASE_URL}/estadisticas`, {
                headers: getAuthHeaders()
            });
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.detail || 'Error al obtener estadísticas del dashboard');
            }
            throw error;
        }
    },

    getMovimientos: async (): Promise<DashboardMovimientos> => {
        try {
            const { data } = await axios.get(`${BASE_URL}/movimientos`, {
                headers: getAuthHeaders()
            });
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.detail || 'Error al obtener movimientos del dashboard');
            }
            throw error;
        }
    },

    getDistribucion: async (): Promise<DashboardDistribucion> => {
        try {
            const { data } = await axios.get(`${BASE_URL}/distribucion`, {
                headers: getAuthHeaders()
            });
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.detail || 'Error al obtener distribución del dashboard');
            }
            throw error;
        }
    }
};