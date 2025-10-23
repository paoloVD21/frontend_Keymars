export interface Ubicacion {
    id_ubicacion: number;
    nombre: string;
    id_sucursal: number;
    activo: boolean;
}

export interface UbicacionResponse {
    ubicaciones: Ubicacion[];
    total: number;
}

export interface CreateUbicacion {
    nombre: string;
    id_sucursal: number;
}