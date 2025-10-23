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
    fecha: string;
    tipo_movimiento: string;
    cantidad_productos: number;
    id_proveedor: number;
    id_usuario: number;
    id_sucursal: number;
    ubicaciones: number[];
    productos: ProductoEntrada[];
}

export interface ProductoEntrada {
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
    id_ubicacion: number;
}

export interface EntradaResponse {
    entrada: Entrada;
    mensaje: string;
}