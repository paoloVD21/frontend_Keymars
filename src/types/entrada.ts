export interface Entrada {
    id_entrada: number;
    fecha: string;
    tipo_movimiento: string;
    cantidad_productos: number;
    id_proveedor: number;
    proveedor: {
        nombre: string;
    };
    id_usuario: number;
    usuario: {
        nombre: string;
    };
    id_sucursal: number;
    sucursal: {
        nombre: string;
    };
}

export interface EntradaCreate {
    id_motivo: number;
    id_sucursal: number;
    id_usuario?: number;
    id_proveedor?: number;
    observacion?: string;
    detalles: DetalleEntrada[];
}

export interface DetalleEntrada {
    id_producto: number;
    id_ubicacion: number;
    cantidad: number;
}

export interface EntradaResponse {
    entrada: Entrada;
    mensaje: string;
}

export interface MovimientoDetalle {
    id_movimiento_detalle: number;
    nombre_producto: string;
    codigo_producto: string;
    ubicacion_nombre: string;
    cantidad: number;
    precio_unitario: string;
    precio_total: string;
    id_producto: number;
    id_ubicacion: number;
}

export interface MovimientoHistorial {
    id_movimiento: number;
    motivo_nombre: string;
    cantidad_total: number;
    proveedor_nombre: string | null;
    nombre_usuario: string;
    sucursal_nombre: string;
    detalles?: MovimientoDetalle[];
}

export interface HistorialResponse {
    movimientos: MovimientoHistorial[];
}