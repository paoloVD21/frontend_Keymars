export interface Rol {
    id_rol: number;
    nombre: string;
}

export interface RolResponse {
    roles: Rol[];
    total: number;
}