export interface User {
    id_usuario: number;
    nombre: string;
    apellido: string;
    email: string;
    id_sucursal: number;
    nombreSucursal?: string;
    sucursalClass?: string;
    id_rol: number;
    rol: string;
    id_supervisor: number | null;
    fecha_creacion: string;
    activo: boolean;
}

export interface UserCreate {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    id_sucursal: number;
    id_rol: number;
    id_supervisor?: number;
    activo: boolean;
}

export interface UserUpdate {
    nombre?: string;
    apellido?: string;
    email?: string;
    password?: string;
    id_sucursal?: number;
    id_rol?: number;
    id_supervisor?: number;
}

export interface UserListResponse {
    total: number;
    usuarios: User[];
}

export interface GetUsersParams {
    skip?: number;
    limit?: number;
    search?: string;
    activo?: boolean;
    rol?: number;
}