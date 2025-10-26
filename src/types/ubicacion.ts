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
    codigo_ubicacion: string;
    tipo_ubicacion: 'ESTANTERIA' | 'REFRIGERADO' | 'SECO' | 'LIQUIDOS' | 'OTROS' | '';
    id_sucursal: number;
}