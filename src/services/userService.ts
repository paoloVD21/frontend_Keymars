import axios from 'axios';
import type { User, UserCreate, UserUpdate, UserListResponse, GetUsersParams } from '../types/user';

const BASE_URL = 'http://localhost:8000/api/users';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    
    return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
};

export const userService = {
    getUsers: async (params?: GetUsersParams): Promise<UserListResponse> => {
        try {
            const { data } = await axios.get<UserListResponse>(`${BASE_URL}/listarUsuarios`, {
                headers: getAuthHeaders(),
                params: {
                    ...params,
                    skip: params?.skip || 0,
                    limit: params?.limit || 10
                }
            });
            console.log('Respuesta del servidor:', data); // Para depuración
            
            // Mapear temporalmente los roles mientras el backend se actualiza
            const rolesMap: Record<number, string> = {
                1: 'Supervisor',
                2: 'Asistente'
            };

            return {
                ...data,
                usuarios: data.usuarios.map(user => ({
                    ...user,
                    rol: rolesMap[user.id_rol] || 'Desconocido',
                    nombreSucursal: `Sucursal ${user.id_sucursal}`,
                    sucursalClass: `sucursal${user.id_sucursal}`
                }))
            };
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error detallado:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                });
                throw new Error(error.response.data.detail || 'Error al obtener usuarios');
            }
            throw error;
        }
    },

    createUser: async (userData: UserCreate): Promise<User> => {
        try {
            const { data } = await axios.post<User>(BASE_URL, userData, {
                headers: getAuthHeaders()
            });
            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error al crear usuario:', error.response.data);
                throw new Error(error.response.data.detail || 'Error al crear usuario');
            }
            throw error;
        }
    },

    updateUser: async (id: number, userData: UserUpdate): Promise<User> => {
        try {
            const { data } = await axios.put<User>(`${BASE_URL}/${id}`, userData, {
                headers: getAuthHeaders()
            });
            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error al actualizar usuario:', error.response.data);
                throw new Error(error.response.data.detail || 'Error al actualizar usuario');
            }
            throw error;
        }
    },

    toggleUserStatus: async (id: number, active: boolean): Promise<User> => {
        try {
            const { data } = await axios.patch<User>(`${BASE_URL}/${id}/status`, { active }, {
                headers: getAuthHeaders()
            });
            return data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error al cambiar estado del usuario:', error.response.data);
                throw new Error(error.response.data.detail || 'Error al cambiar estado del usuario');
            }
            throw error;
        }
    }
};