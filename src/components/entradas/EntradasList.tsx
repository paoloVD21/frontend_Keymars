import React, { useState } from 'react';
import styles from './EntradasList.module.css';
import { entradaService } from '../../services/entradaService';
import type { MovimientoHistorial } from '../../types/entrada';
import { CreateEntradaModal } from './CreateEntradaModal';
import { DetallesMovimientoModal } from './DetallesMovimientoModal';

export const EntradasList: React.FC = () => {
    const [entradas, setEntradas] = useState<MovimientoHistorial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedMovimiento, setSelectedMovimiento] = useState<MovimientoHistorial | null>(null);
    const [isDetallesModalOpen, setIsDetallesModalOpen] = useState(false);

    const loadEntradas = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Cargando entradas para fecha:', selectedDate);
            const data = await entradaService.getHistorialMovimientos(selectedDate);
            console.log('Datos recibidos:', data);
            console.log('Movimientos:', data.movimientos);
            setEntradas(data.movimientos || []);
            console.log('Estado de entradas actualizado:', data.movimientos || []);
        } catch (error) {
            console.error('Error al cargar entradas:', error);
            setError('Error al cargar las entradas');
            setEntradas([]); // Aseguramos que siempre haya un array vacío en caso de error
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

    const handleEntradaCreated = () => {
        loadEntradas();
    };

    const handleVerDetalles = (movimiento: MovimientoHistorial) => {
        setSelectedMovimiento(movimiento);
        setIsDetallesModalOpen(true);
    };

    const handleCloseDetalles = () => {
        setIsDetallesModalOpen(false);
        setSelectedMovimiento(null);
    };

    React.useEffect(() => {
        loadEntradas();
    }, [loadEntradas]);

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
                        Registrar Ingreso
                    </button>
                </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={`${styles.tableContainer} ${loading ? styles.loading : ''}`}>
                {loading ? (
                    <div className={styles.loadingOverlay}>
                        <span>Cargando entradas...</span>
                    </div>
                ) : null}
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Motivo</th>
                            <th>Cantidad Total</th>
                            <th>Proveedor</th>
                            <th>Usuario</th>
                            <th>Sucursal</th>
                            <th>Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entradas.length > 0 ? (
                            entradas.map((movimiento) => (
                                <tr key={movimiento.id_movimiento}>
                                    <td>{movimiento.motivo_nombre}</td>
                                    <td>{movimiento.cantidad_total}</td>
                                    <td>{movimiento.proveedor_nombre}</td>
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
                                <td colSpan={6} className={styles.noData}>
                                    No hay entradas registradas para esta fecha
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <CreateEntradaModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                onSuccess={handleEntradaCreated}
            />

            <DetallesMovimientoModal
                isOpen={isDetallesModalOpen}
                onClose={handleCloseDetalles}
                movimiento={selectedMovimiento}
            />
        </div>
    );
};