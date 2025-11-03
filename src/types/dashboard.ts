export interface DashboardStats {
    totalProductos: number;
    stockDisponible: number;
    proveedoresActivos: number;
    tendencias: {
        productos: { valor: string; esPositivo: boolean };
        stock: { valor: string; esPositivo: boolean };
        proveedores: { valor: string; esPositivo: boolean };
    };
}

export interface DashboardMovimientos {
    labels: string[];
    entradas: number[];
    salidas: number[];
}

export interface DashboardDistribucion {
    labels: string[];
    data: number[];
}