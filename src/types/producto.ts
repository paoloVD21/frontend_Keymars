export interface Producto {
    id_producto: number;
    codigo_producto: string;
    nombre: string;
    descripcion?: string;
    id_categoria?: number;
    categoria?: {
        id_categoria: number;
        nombre: string;
        activo: boolean;
    };
    id_marca?: number;
    marca?: {
        id_marca: number;
        nombre: string;
        activo: boolean;
    };
    id_proveedor?: number;
    proveedor?: {
        id_proveedor: number;
        nombre: string;
        activo: boolean;
    };
    stock_actual: number;
    precio?: number;
    activo: boolean;
    unidad_medida: string;
    fecha_creacion: string;
}

export interface ProductoUpdate {
    nombre: string;
    descripcion?: string;
    codigo_producto: string;
    id_categoria?: number;
    id_marca?: number;
    id_proveedor?: number;
    precio?: number;
    unidad_medida?: string;
    sucursal_id?: number;
    ubicaciones?: number[];
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