import axios from 'axios';
import type { Alerta, AlertaResponse, AlertaFiltros } from '../types/alerta';

const BASE_URL = 'http://localhost:8000/api/alertas';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    
    return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
};

export const obtenerHistorialAlertas = async (
    filtros: AlertaFiltros = {}
): Promise<{ alertas: Alerta[] }> => {
    try {
        // Limpiar filtros vacíos o undefined
        const params = Object.fromEntries(
            Object.entries(filtros).filter(([, value]) => 
                value !== undefined && value !== ''
            )
        ) as AlertaFiltros;

        const { data } = await axios.get<AlertaResponse>(
            `${BASE_URL}/historial`,
            {
                headers: getAuthHeaders(),
                params
            }
        );
        
        return {
            alertas: data.alertas
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error completo:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                url: error.config?.url,
                params: error.config?.params,
                headers: error.config?.headers
            });
            throw new Error(error.response?.data?.detail || 'Error al obtener historial de alertas');
        }
        throw error;
    }
};