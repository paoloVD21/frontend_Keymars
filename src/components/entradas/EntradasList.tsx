import React, { useState } from 'react';
import styles from './EntradasList.module.css';
import { entradaService } from '../../services/entradaService';
import type { Entrada } from '../../types/entrada';
import { CreateEntradaModal } from './CreateEntradaModal';

export const EntradasList: React.FC = () => {
    const [entradas, setEntradas] = useState<Entrada[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const loadEntradas = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await entradaService.getEntradas(selectedDate);
            setEntradas(data.entradas || []);
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

    React.useEffect(() => {
        loadEntradas();
    }, [loadEntradas]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Movimientos de Entrada</h2>
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
                            <th>Fecha</th>
                            <th>Tipo de Movimiento</th>
                            <th>Cantidad de Productos</th>
                            <th>Proveedor</th>
                            <th>Usuario</th>
                            <th>Sucursal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entradas.length > 0 ? (
                            entradas.map((entrada) => (
                                <tr key={entrada.id_entrada}>
                                    <td>{formatDate(entrada.fecha)}</td>
                                    <td>{entrada.tipo_movimiento}</td>
                                    <td>{entrada.cantidad_productos}</td>
                                    <td>{entrada.proveedor.nombre}</td>
                                    <td>{entrada.usuario.nombre}</td>
                                    <td>{entrada.sucursal.nombre}</td>
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
        </div>
    );
};