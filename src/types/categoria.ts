export interface Categoria {
    id_categoria: number;
    nombre: string;
    activo: boolean;
}

export interface CategoriaUpdate {
    nombre: string;
}