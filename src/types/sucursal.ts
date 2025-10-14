export interface Sucursal {
    id_sucursal: number;
    nombre: string;
}

export interface SucursalResponse {
    sucursales: Sucursal[];
    total: number;
}