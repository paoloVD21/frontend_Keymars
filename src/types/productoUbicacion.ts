import type { Ubicacion } from './ubicacion';
import type { Sucursal } from './sucursal';

export interface ProductoUbicacion {
    id_producto: number;
    id_ubicacion: number;
    ubicacion: Ubicacion;
    sucursal: Sucursal;
}

export interface ProductoUbicacionResponse {
    ubicaciones: ProductoUbicacion[];
    total: number;
}