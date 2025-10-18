export interface Proveedor {
    id_proveedor: number;
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
    activo: boolean;
    fecha_creacion: string;
}

export interface ProveedorCreate {
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
    activo: boolean;
}

export interface ProveedorUpdate {
    nombre?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
}

export interface ProveedorListResponse {
    total: number;
    proveedores: Proveedor[];
}

export interface GetProveedoresParams {
    skip?: number;
    limit?: number;
    search?: string;
    activo?: boolean;
}