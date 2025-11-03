export interface Alerta {
    id_alerta: number;
    id_inventario: number;
    fecha_alerta: string;
    cantidad_actual: number;
    estado: 'creado' | 'stock_minimo' | 'stock_bajo';
    observacion: string;
    nombre_producto: string;
    codigo_producto: string;
    nombre_sucursal: string;
    nombre_proveedor: string;
}

export interface AlertaFiltros {
    // Filtro de estado (creado, stock_minimo, stock_bajo)
    estado?: 'creado' | 'stock_minimo' | 'stock_bajo';

    // Filtro de sucursal
    id_sucursal?: number;

    // Filtro de fecha (mes y año combinados)
    mes?: string;  // formato: 'YYYY-MM'
}

export interface AlertaResponse {
    alertas: Alerta[];
    total: number;
    pagina_actual: number;
    total_paginas: number;
    elementos_por_pagina: number;
}