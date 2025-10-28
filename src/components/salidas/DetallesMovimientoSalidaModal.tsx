import React, { useState, useEffect } from 'react';
import type { MovimientoHistorialSalida } from '../../types/salida';
import { salidaService } from '../../services/salidaService';
import styles from './DetallesMovimientoSalidaModal.module.css';

interface DetallesMovimientoSalidaModalProps {
    isOpen: boolean;
    onClose: () => void;
    movimiento: MovimientoHistorialSalida | null;
}

export const DetallesMovimientoSalidaModal: React.FC<DetallesMovimientoSalidaModalProps> = ({
    isOpen,
    onClose,
    movimiento
}) => {
    const [detallesMovimiento, setDetallesMovimiento] = useState<MovimientoHistorialSalida | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && movimiento) {
            const cargarDetalles = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const detalles = await salidaService.getDetallesMovimiento(movimiento.id_movimiento);
                    setDetallesMovimiento(detalles);
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Error al cargar los detalles');
                    console.error('Error al cargar detalles:', err);
                } finally {
                    setLoading(false);
                }
            };
            cargarDetalles();
        } else {
            setDetallesMovimiento(null);
        }
    }, [isOpen, movimiento]);

    if (!isOpen || !movimiento) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Detalles del Movimiento</h2>
                    <button onClick={onClose} className={styles.closeButton}>
                        <span>&times;</span>
                    </button>
                </div>

                {loading ? (
                    <div className={styles.loadingContainer}>Cargando detalles...</div>
                ) : error ? (
                    <div className={styles.errorMessage}>{error}</div>
                ) : (
                    <>
                        <div className={styles.modalBody}>
                            <div className={styles.modalSection}>
                                <h3 className={styles.sectionTitle}>Información General</h3>
                                <div className={styles.modalGrid}>
                                    <div className={styles.modalField}>
                                        <p className={styles.fieldLabel}>Motivo:</p>
                                        <p className={styles.fieldValue}>{detallesMovimiento?.motivo_nombre}</p>
                                    </div>
                                    <div className={styles.modalField}>
                                        <p className={styles.fieldLabel}>Cantidad Total:</p>
                                        <p className={styles.fieldValue}>{detallesMovimiento?.cantidad_total}</p>
                                    </div>
                                    <div className={styles.modalField}>
                                        <p className={styles.fieldLabel}>Usuario:</p>
                                        <p className={styles.fieldValue}>{detallesMovimiento?.nombre_usuario}</p>
                                    </div>
                                    <div className={styles.modalField}>
                                        <p className={styles.fieldLabel}>Sucursal:</p>
                                        <p className={styles.fieldValue}>{detallesMovimiento?.sucursal_nombre}</p>
                                    </div>
                                </div>
                            </div>

                            {detallesMovimiento?.detalles && detallesMovimiento.detalles.length > 0 && (
                                <div className={styles.detallesTable}>
                                    <h3 className={styles.sectionTitle}>Productos</h3>
                                    <div className={styles.tableWrapper}>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Código</th>
                                                    <th>Producto</th>
                                                    <th>Ubicación</th>
                                                    <th>Cantidad</th>
                                                    <th>P. Unit.</th>
                                                    <th>P. Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {detallesMovimiento.detalles.map((detalle) => (
                                                    <tr key={detalle.id_movimiento_detalle}>
                                                        <td>{detalle.codigo_producto}</td>
                                                        <td>{detalle.nombre_producto}</td>
                                                        <td>{detalle.ubicacion_nombre}</td>
                                                        <td>{detalle.cantidad}</td>
                                                        <td>S/ {detalle.precio_unitario}</td>
                                                        <td>S/ {detalle.precio_total}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className={styles.totalRow}>
                                                    <td colSpan={5} style={{ textAlign: 'right', fontWeight: 'bold' }}>Total:</td>
                                                    <td style={{ fontWeight: 'bold' }}>
                                                        S/ {detallesMovimiento.detalles.reduce((sum, detalle) => sum + Number(detalle.precio_total), 0).toFixed(2)}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                <div className={styles.modalFooter}>
                    <button onClick={onClose} className={styles.cerrarButton}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};