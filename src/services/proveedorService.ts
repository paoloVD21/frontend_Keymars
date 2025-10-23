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
    },

    // Función simplificada para obtener solo ID y nombre de proveedores para el modal
    getProveedoresSimple: async (): Promise<{ proveedores: { id_proveedor: number; nombre: string }[]; total: number }> => {
        try {
            console.log('📝 [ProveedorService] Obteniendo lista de proveedores...');
            
            const response = await axios.get<Proveedor[]>(`${BASE_URL}/listarModalProveedores`, {
                headers: getAuthHeaders()
            });
            
            console.log('Respuesta completa:', response);
            const { data } = response;
            
            // Validación exhaustiva de la respuesta
            if (!Array.isArray(data)) {
                console.error('❌ [ProveedorService] Formato de respuesta inválido:', data);
                throw new Error('Formato de respuesta inválido');
            }

            // Transformamos y validamos cada proveedor
            const proveedores = data
                .filter(p => p && typeof p === 'object' && 
                           'id_proveedor' in p && 'nombre' in p)
                .map(p => ({
                    id_proveedor: Number(p.id_proveedor),
                    nombre: String(p.nombre).trim()
                }))
                .filter(p => !isNaN(p.id_proveedor) && p.nombre);

            console.log('Proveedores filtrados:', proveedores);
            
            console.log('✅ [ProveedorService] Proveedores procesados:', {
                total: proveedores.length,
                muestra: proveedores.slice(0, 3)
            });
            
            return {
                proveedores,
                total: proveedores.length
            };
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error al obtener proveedores:', error.response.data);
                throw new Error(error.response.data.detail || 'Error al obtener proveedores');
            }
            throw error;
        }
    }
};