export interface Producto {
    id_producto: number;
    codigo_producto: string;
    nombre: string;
    descripcion: string | null;
    id_categoria: number;
    categoria?: {
        id_categoria: number;
        nombre: string;
        activo: boolean;
    };
    id_marca: number | null;
    marca?: {
        id_marca: number;
        nombre: string;
        activo: boolean;
    };
    id_proveedor: number;
    proveedor_nombre?: string;
    categoria_nombre?: string;
    marca_nombre?: string;
    stock_actual: number;
    stock_minimo: number;
    precio: number;
    activo: boolean;
    unidad_medida: string;
    fecha_creacion: string;
}

export interface ProductoUpdate {
    nombre: string;
    descripcion: string | null;
    codigo_producto: string;
    id_categoria: number;
    id_marca: number | null;
    id_proveedor: number;  // ID del proveedor para la tabla producto_proveedor
    precio: number;
    unidad_medida: string;
    stock_minimo: number;
}

export interface GetProductosParams {
    search?: string;
    skip?: number;
    limit?: number;
    id_categoria?: number;
    id_proveedor?: number;
    activo?: boolean;
}

export interface ProductoListResponse {
    productos: Producto[];
    total: number;
}