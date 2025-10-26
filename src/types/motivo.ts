export interface Motivo {
    id_motivo: number;
    nombre: string;
    tipo_movimiento: 'ENTRADA' | 'SALIDA';
    activo: boolean;
}

export interface MotivoResponse {
    motivos: Motivo[];
}