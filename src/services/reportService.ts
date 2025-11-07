import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/reports`;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    
    return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
};

export interface ReportParams {
    tipo_reporte: 'resumen_inventario' | 'stock_bajo' | 'mayores_movimientos';
    periodo: 'ultimo_mes' | 'ultimo_trimestre' | 'ultimo_anio';
    id_sucursal?: number;
}

export const reportService = {
    exportToExcel: async (params: ReportParams): Promise<Blob> => {
        try {
            const response = await axios.post(
                `${BASE_URL}/excel`,
                params,
                {
                    headers: {
                        ...getAuthHeaders(),
                        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    },
                    responseType: 'blob'
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error al generar reporte Excel:', error);
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.detail || 'Error al generar el reporte Excel');
            }
            throw error;
        }
    },

    exportToPDF: async (params: ReportParams): Promise<Blob> => {
        try {
            const response = await axios.post(
                `${BASE_URL}/pdf`,
                params,
                {
                    headers: {
                        ...getAuthHeaders(),
                        'Accept': 'application/pdf'
                    },
                    responseType: 'blob'
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error al generar reporte PDF:', error);
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.detail || 'Error al generar el reporte PDF');
            }
            throw error;
        }
    }
};