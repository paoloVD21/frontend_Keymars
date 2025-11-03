import React from 'react';
import styles from './MovimientosWidget.module.css';

interface MovimientosWidgetProps {
    isLoading?: boolean;
}

const MovimientosWidget: React.FC<MovimientosWidgetProps> = ({
    isLoading = false
}) => {
    return (
        <div className={styles.widget}>
            <div className={styles.header}>
                <h3 className={styles.title}>Movimientos Recientes</h3>
                <span className="material-icons">sync_alt</span>
            </div>
            
            <div className={styles.content}>
                {isLoading ? (
                    <div className={styles.loading}>
                        <div className={styles.skeleton}></div>
                        <div className={styles.skeleton}></div>
                        <div className={styles.skeleton}></div>
                    </div>
                ) : (
                    <div className={styles.movimientosList}>
                        {/* Lista de movimientos se agregará aquí */}
                        <div className={styles.emptyState}>
                            No hay movimientos recientes
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovimientosWidget;