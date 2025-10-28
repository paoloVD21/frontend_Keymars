import axios from 'axios';
import type { SalidaCreate, SalidaResponse, HistorialSalidaResponse, MovimientoHistorialSalida } from '../types/salida';

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

export const salidaService = {
    getMotivosSalida: async (): Promise<string[]> => {
        try {
            const { data } = await axios.get<string[]>(
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
    },

    registrarSalida: async (salida: SalidaCreate): Promise<SalidaResponse> => {
        try {
            console.log('Iniciando registro de salida...');
            console.log('Datos recibidos del formulario:', salida);

            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');
            
            console.log('Token encontrado');
            
            // Extraer el ID del usuario del token
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Token inválido');
            }

            let userId: number;
            try {
                const payload = JSON.parse(atob(parts[1]));
                console.log('Payload del token:', payload);
                
                if (!payload.sub) {
                    throw new Error('ID de usuario no encontrado en el token');
                }
                userId = parseInt(payload.sub);
                if (isNaN(userId)) {
                    throw new Error('ID de usuario inválido en el token');
                }
                console.log('ID de usuario extraído:', userId);
            } catch (tokenError) {
                console.error('Error al decodificar el token:', tokenError);
                throw new Error('Error al obtener el ID de usuario del token');
            }

            const datosAEnviar = {
                ...salida,
                id_usuario: userId
            };
            
            console.log('Datos completos a enviar al backend:', datosAEnviar);
            console.log('URL de destino:', `${BASE_URL}/registrarSalida`);
            console.log('Headers:', getAuthHeaders());

            const { data } = await axios.post<SalidaResponse>(
                `${BASE_URL}/registrarSalida`,
                datosAEnviar,
                {
                    headers: getAuthHeaders()
                }
            );
            console.log('Respuesta exitosa del backend:', data);
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error de Axios:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    headers: error.response?.headers
                });
                if (error.response?.data) {
                    console.error('Detalle del error del backend:', error.response.data);
                    throw new Error(error.response.data.detail || 'Error al registrar salida');
                }
            } else if (error instanceof Error) {
                console.error('Error no relacionado con Axios:', error.message);
                throw error;
            } else {
                console.error('Error desconocido:', error);
                throw new Error('Error desconocido al registrar salida');
            }
            throw new Error('Error en el registro de salida');
        }
    },

    getHistorialMovimientos: async (fecha: string): Promise<HistorialSalidaResponse> => {
        try {
            console.log('Solicitando historial de salidas para fecha:', fecha);
            const { data } = await axios.get(
                `${BASE_URL}/historial/salidas/${fecha}`,
                {
                    headers: getAuthHeaders()
                }
            );
            console.log('Respuesta del historial:', data);

            // Formatear la respuesta según su estructura
            if (Array.isArray(data)) {
                return {
                    movimientos: data
                };
            }
            return data;
        } catch (error) {
            console.error('Error al obtener historial de salidas:', error);
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.detail || 'Error al obtener el historial de salidas');
            }
            throw error;
        }
    },

    getDetallesMovimiento: async (id: number): Promise<MovimientoHistorialSalida> => {
        try {
            const { data } = await axios.get<MovimientoHistorialSalida>(
                `${BASE_URL}/${id}`,
                {
                    headers: getAuthHeaders()
                }
            );
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.detail || 'Error al obtener detalles del movimiento');
            }
            throw error;
        }
    },

    createSalida: async (salida: SalidaCreate): Promise<SalidaResponse> => {
        try {
            const { data } = await axios.post<SalidaResponse>(
                `${BASE_URL}/salidas`,
                salida,
                {
                    headers: getAuthHeaders()
                }
            );
            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                console.error('Error al crear salida:', error.response.data);
                throw new Error(error.response.data.detail || 'Error al crear salida');
            }
            throw new Error('Error al crear salida');
        }
    }
};