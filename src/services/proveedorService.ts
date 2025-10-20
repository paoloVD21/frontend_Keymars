import axios from 'axios';
import type { Proveedor, ProveedorCreate, ProveedorUpdate, ProveedorListResponse, GetProveedoresParams } from '../types/proveedor';

const BASE_URL = 'http://localhost:8000/api/suppliers';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    
    return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
};

export const proveedorService = {
    getProveedores: async (params?: GetProveedoresParams): Promise<ProveedorListResponse> => {
        try {
            const { data } = await axios.get<ProveedorListResponse>(`${BASE_URL}/ListarProveedores`,{
                headers: getAuthHeaders(),
                params: {
                  ...params,
                  skip: params?.skip || 0,
                  limit: params?.limit || 10,
                },
            });
            console.log('Respuesta del servidor:', data);

            const proveedoresOrdenados = data.proveedores
                .map(proveedor => ({
                    ...proveedor
                }))
                .sort((a, b) => a.id_proveedor - b.id_proveedor);

            return {
                proveedores: proveedoresOrdenados,
                total: data.total
            };
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error detallado:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                });
                throw new Error(error.response.data.detail || 'Error al obtener proveedores');
            }
            throw error;
        }
    },

    createProveedor: async (proveedorData: ProveedorCreate): Promise<Proveedor> => {
        try {
            console.log('Datos enviados al crear proveedor:', proveedorData);
            
            const { data } = await axios.post<Proveedor>(
              `${BASE_URL}/crearProveedor`,
              proveedorData,
              {
                headers: getAuthHeaders(),
              }
            );
            
            console.log('Respuesta del servidor:', data);
            return data;
        } catch (error) {
            console.error('Error completo:', error);
            if (axios.isAxiosError(error)) {
                console.error('Detalles del error:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    headers: error.response?.headers,
                    config: {
                        url: error.config?.url,
                        method: error.config?.method,
                        data: error.config?.data,
                        headers: error.config?.headers
                    }
                });
                throw new Error(error.response?.data?.detail || 'Error al crear proveedor');
            }
            throw error;
        }
    },

    updateProveedor: async (id: number, proveedorData: ProveedorUpdate): Promise<Proveedor> => {
        try {
            const { data } = await axios.put<Proveedor>(
                `${BASE_URL}/actualizarProveedor/${id}`,
                proveedorData,
                {
                    headers: getAuthHeaders()
                }
            );
            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error al actualizar proveedor:', error.response.data);
                throw new Error(error.response.data.detail || 'Error al actualizar proveedor');
            }
            throw error;
        }
    },

    toggleProveedorStatus: async (id: number): Promise<Proveedor> => {
        try {
            const { data } = await axios.patch<Proveedor>(
                `${BASE_URL}/cambiarEstadoProveedor/${id}`,
                {},
                {
                    headers: getAuthHeaders()
                }
            );
            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error al cambiar estado del proveedor:', error.response.data);
                throw new Error(error.response.data.detail || 'Error al cambiar estado del proveedor');
            }
            throw error;
        }
    },

    getProveedor: async (id: number): Promise<Proveedor> => {
        try {
            const { data } = await axios.get<Proveedor>(
                `${BASE_URL}/obtenerProveedor/${id}`,
                {
                    headers: getAuthHeaders()
                }
            );
            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error al obtener proveedor:', error.response.data);
                throw new Error(error.response.data.detail || 'Error al obtener proveedor');
            }
            throw error;
        }
    }
};