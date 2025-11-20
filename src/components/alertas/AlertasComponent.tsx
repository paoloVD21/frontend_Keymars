import { useState, useEffect } from 'react';
import ListaAlertas from './ListaAlertas';
import FiltroAlertas from './FiltroAlertas';
import styles from './AlertasComponent.module.css';
import { obtenerHistorialAlertas } from '../../services/alertaService';
import type { Alerta, AlertaFiltros } from '../../types/alerta';

export default function AlertasComponent() {
    const [alertas, setAlertas] = useState<Alerta[]>([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filtros, setFiltros] = useState<AlertaFiltros>({});

    const cargarAlertas = async (filtrosActuales = filtros) => {
        try {
            setCargando(true);
            setError(null);
            const { alertas: nuevasAlertas } = await obtenerHistorialAlertas(filtrosActuales);
            setAlertas(nuevasAlertas);
        } catch (error) {
            console.error('Error al cargar alertas:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error al cargar las alertas';
            setError(errorMessage);
            setAlertas([]);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarAlertas(filtros);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtros]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Historial de Alertas</h2>
            </div>
            
            {error && (
                <div className={styles.errorMessage}>
                    {error}
                </div>
            )}
            
            <FiltroAlertas 
                onFiltrar={setFiltros}
                filtrosActuales={filtros}
            />
            
            <ListaAlertas 
                alertas={alertas}
                cargando={cargando}
            />
        </div>
    );
}