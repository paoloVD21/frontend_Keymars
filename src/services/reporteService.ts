import axios from 'axios';

interface ReporteParams {
    fechaInicio?: string;
    fechaFin?: string;
    sucursal?: number;
    categoria?: number;
    producto?: number;
    tipoReporte: string;
    subTipoReporte: string;
    formato: 'excel' | 'pdf';
}

class ReporteService {
    private baseUrl = 'http://localhost:3001/api/reportes';

    async generarReporte(params: ReporteParams): Promise<Blob> {
        try {
            const response = await axios.get(`${this.baseUrl}/generar`, {
                params,
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Error al generar el reporte');
            }
            throw error;
        }
    }

    async obtenerEstadisticas() {
        try {
            const response = await axios.get(`${this.baseUrl}/estadisticas`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
            }
            throw error;
        }
    }

    descargarArchivo(blob: Blob, filename: string) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }

    generarNombreArchivo(params: ReporteParams): string {
        const fecha = new Date().toISOString().split('T')[0];
        const tipo = params.tipoReporte;
        const subtipo = params.subTipoReporte;
        const formato = params.formato;
        return `reporte_${tipo}_${subtipo}_${fecha}.${formato}`;
    }
}

export const reporteService = new ReporteService();