export interface Salida {
    id_salida: number;
    fecha: string;
    tipo_movimiento: string;
    cantidad_productos: number;
    id_usuario: number;
    usuario: {
        nombre: string;
    };
    id_sucursal: number;
    sucursal: {
        nombre: string;
    };
}

export interface SalidaCreate {
    id_motivo: number;
    id_sucursal: number;
    id_usuario?: number;
    observacion?: string;
    detalles: DetalleSalida[];
}

export interface DetalleSalida {
    id_producto: number;
    id_ubicacion: number;
    cantidad: number;
}

export interface SalidaResponse {
    salida: Salida;
    mensaje: string;
}

export interface MovimientoDetalleSalida {
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

export interface MovimientoHistorialSalida {
    id_movimiento: number;
    motivo_nombre: string;
    cantidad_total: number;
    nombre_usuario: string;
    sucursal_nombre: string;
    detalles?: MovimientoDetalleSalida[];
}

export interface HistorialSalidaResponse {
    movimientos: MovimientoHistorialSalida[];
}