import axios from 'axios';
import type { Entrada, EntradaCreate, EntradaResponse, HistorialResponse, MovimientoHistorial } from '../types/entrada';

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

export const entradaService = {
    getEntradas: async (fecha?: string): Promise<{ entradas: Entrada[] }> => {
        try {
            const url = fecha ? `${BASE_URL}/historial/${fecha}` : `${BASE_URL}/entradas`;
            console.log('Solicitando entradas con URL:', url);
            
            const { data } = await axios.get<{ entradas: Entrada[] }>(
                url,
                {
                    headers: getAuthHeaders()
                }
            );
            
            console.log('Respuesta recibida:', data);
            return {
                entradas: data.entradas || []
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error al obtener entradas:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    url: error.config?.url
                });
                throw new Error(error.response?.data?.detail || `Error al obtener entradas${fecha ? ' para la fecha ' + fecha : ''}`);
            }
            console.error('Error no relacionado con Axios:', error);
            throw error;
        }
    },

    registrarIngreso: async (entrada: EntradaCreate): Promise<EntradaResponse> => {
        try {
            console.log('Iniciando registro de ingreso...');
            console.log('Datos recibidos del formulario:', entrada);

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
            // Si llegamos aquí, tenemos un userId válido

            const datosAEnviar = {
                ...entrada,
                id_usuario: userId
            };
            
            console.log('Datos completos a enviar al backend:', datosAEnviar);
            console.log('URL de destino:', `${BASE_URL}/registrarIngreso`);
            console.log('Headers:', getAuthHeaders());

            const { data } = await axios.post<EntradaResponse>(
                `${BASE_URL}/registrarIngreso`,
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
                    throw new Error(error.response.data.detail || 'Error al crear entrada');
                }
            } else if (error instanceof Error) {
                console.error('Error no relacionado con Axios:', error.message);
                throw error;
            } else {
                console.error('Error desconocido:', error);
                throw new Error('Error desconocido al crear entrada');
            }
            throw new Error('Error en el registro de ingreso'); // Return final para satisfacer TypeScript
        }
    },

    createEntrada: async (entrada: EntradaCreate): Promise<EntradaResponse> => {
        try {
            const { data } = await axios.post<EntradaResponse>(
                `${BASE_URL}/entradas`,
                entrada,
                {
                    headers: getAuthHeaders()
                }
            );
            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                console.error('Error al crear entrada:', error.response.data);
                throw new Error(error.response.data.detail || 'Error al crear entrada');
            }
            throw new Error('Error al crear entrada');
        }
    },

    getEntradaPorId: async (id: number): Promise<EntradaResponse> => {
        try {
            const { data } = await axios.get<EntradaResponse>(
                `${BASE_URL}/entradas/${id}`,
                {
                    headers: getAuthHeaders()
                }
            );
            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error al obtener entrada:', error.response.data);
                throw new Error(error.response.data.detail || 'Error al obtener entrada');
            }
            throw error;
        }
    },

    getHistorialMovimientos: async (fecha: string): Promise<HistorialResponse> => {
        try {
            console.log('Solicitando historial de entradas para fecha:', fecha);
            const { data } = await axios.get(
                `${BASE_URL}/historial/entradas/${fecha}`,
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
            console.error('Error al obtener historial de entradas:', error);
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.detail || 'Error al obtener el historial de entradas');
            }
            throw error;
        }
    },

    getDetallesMovimiento: async (movimientoId: number): Promise<MovimientoHistorial> => {
        try {
            console.log('Solicitando detalles del movimiento:', movimientoId);
            const { data } = await axios.get(
                `${BASE_URL}/${movimientoId}`,
                {
                    headers: getAuthHeaders()
                }
            );
            console.log('Respuesta de detalles:', data);
            return data;
        } catch (error) {
            console.error('Error al obtener detalles del movimiento:', error);
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.detail || 'Error al obtener los detalles del movimiento');
            }
            throw error;
        }
    }
};