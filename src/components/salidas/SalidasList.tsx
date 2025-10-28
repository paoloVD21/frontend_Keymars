import React, { useState } from 'react';
import styles from './SalidasList.module.css';
import { salidaService } from '../../services/salidaService';
import type { MovimientoHistorialSalida } from '../../types/salida.ts';
import { CreateSalidaModal } from './CreateSalidaModal';
import { DetallesMovimientoSalidaModal } from './DetallesMovimientoSalidaModal';

export const SalidasList: React.FC = () => {
    const [salidas, setSalidas] = useState<MovimientoHistorialSalida[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedMovimiento, setSelectedMovimiento] = useState<MovimientoHistorialSalida | null>(null);
    const [isDetallesModalOpen, setIsDetallesModalOpen] = useState(false);

    const loadSalidas = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await salidaService.getHistorialMovimientos(selectedDate);
            setSalidas(data.movimientos || []);
        } catch (error) {
            console.error('Error al cargar salidas:', error);
            setError('Error al cargar las salidas');
            setSalidas([]);
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(event.target.value);
    };

    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const handleSalidaCreated = () => {
        loadSalidas();
    };

    const handleVerDetalles = (movimiento: MovimientoHistorialSalida) => {
        setSelectedMovimiento(movimiento);
        setIsDetallesModalOpen(true);
    };

    const handleCloseDetalles = () => {
        setIsDetallesModalOpen(false);
        setSelectedMovimiento(null);
    };

    React.useEffect(() => {
        loadSalidas();
    }, [loadSalidas]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.filters}>
                    <div className={styles.dateFilter}>
                        <label htmlFor="date">Fecha:</label>
                        <input
                            type="date"
                            id="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className={styles.dateInput}
                            disabled={loading}
                        />
                    </div>
                    <button
                        onClick={handleOpenCreateModal}
                        className={styles.createButton}
                        disabled={loading}
                    >
                        Registrar Salida
                    </button>
                </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={`${styles.tableContainer} ${loading ? styles.loading : ''}`}>
                {loading ? (
                    <div className={styles.loadingOverlay}>
                        <span>Cargando salidas...</span>
                    </div>
                ) : null}
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Motivo</th>
                            <th>Cantidad Total</th>
                            <th>Usuario</th>
                            <th>Sucursal</th>
                            <th>Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salidas.length > 0 ? (
                            salidas.map((movimiento) => (
                                <tr key={movimiento.id_movimiento}>
                                    <td>{movimiento.motivo_nombre}</td>
                                    <td>{movimiento.cantidad_total}</td>
                                    <td>{movimiento.nombre_usuario}</td>
                                    <td>{movimiento.sucursal_nombre}</td>
                                    <td>
                                        <button
                                            onClick={() => handleVerDetalles(movimiento)}
                                            className={styles.detallesButton}
                                        >
                                            Ver detalles
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className={styles.noData}>
                                    No hay salidas registradas para esta fecha
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <CreateSalidaModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                onSuccess={handleSalidaCreated}
            />

            <DetallesMovimientoSalidaModal
                isOpen={isDetallesModalOpen}
                onClose={handleCloseDetalles}
                movimiento={selectedMovimiento}
            />
        </div>
    );
};