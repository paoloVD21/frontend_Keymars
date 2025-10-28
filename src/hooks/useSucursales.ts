import { useState, useEffect } from 'react';
import { sucursalService } from '../services/sucursalService';
import type { Sucursal } from '../types/sucursal';

export const useSucursales = () => {
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSucursales = async () => {
            try {
                setIsLoading(true);
                const response = await sucursalService.getSucursales();
                setSucursales(response.sucursales);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar las sucursales');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSucursales();
    }, []);

    return { sucursales, isLoading, error };
};