import React from 'react';
import type { MovimientoHistorial } from '../../types/entrada';
import styles from './DetallesMovimientoModal.module.css';

interface DetallesMovimientoModalProps {
    isOpen: boolean;
    onClose: () => void;
    movimiento: MovimientoHistorial | null;
}

export const DetallesMovimientoModal: React.FC<DetallesMovimientoModalProps> = ({
    isOpen,
    onClose,
    movimiento
}) => {
    if (!isOpen || !movimiento) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Detalles del Movimiento</h2>
                    <button
                        onClick={onClose}
                        className={styles.closeButton}
                    >
                        <span>&times;</span>
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.modalField}>
                        <p className={styles.fieldLabel}>Motivo:</p>
                        <p className={styles.fieldValue}>{movimiento.motivo_nombre}</p>
                    </div>
                    <div className={styles.modalField}>
                        <p className={styles.fieldLabel}>Cantidad Total:</p>
                        <p className={styles.fieldValue}>{movimiento.cantidad_total}</p>
                    </div>
                    {movimiento.proveedor_nombre && (
                        <div className={styles.modalField}>
                            <p className={styles.fieldLabel}>Proveedor:</p>
                            <p className={styles.fieldValue}>{movimiento.proveedor_nombre}</p>
                        </div>
                    )}
                    <div className={styles.modalField}>
                        <p className={styles.fieldLabel}>Usuario:</p>
                        <p className={styles.fieldValue}>{movimiento.nombre_usuario}</p>
                    </div>
                    <div className={styles.modalField}>
                        <p className={styles.fieldLabel}>Sucursal:</p>
                        <p className={styles.fieldValue}>{movimiento.sucursal_nombre}</p>
                    </div>
                    </div>

                <div className={styles.modalFooter}>
                    <button
                        onClick={onClose}
                        className={styles.cerrarButton}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};