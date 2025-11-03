import React from 'react';
import styles from './AlertasRecientesWidget.module.css';

interface AlertasRecientesWidgetProps {
    isLoading?: boolean;
}

const AlertasRecientesWidget: React.FC<AlertasRecientesWidgetProps> = ({
    isLoading = false
}) => {
    return (
        <div className={styles.widget}>
            <div className={styles.header}>
                <h3 className={styles.title}>Alertas Recientes</h3>
                <span className="material-icons">notifications</span>
            </div>
            
            <div className={styles.content}>
                {isLoading ? (
                    <div className={styles.loading}>
                        <div className={styles.skeleton}></div>
                        <div className={styles.skeleton}></div>
                        <div className={styles.skeleton}></div>
                    </div>
                ) : (
                    <div className={styles.alertList}>
                        {/* Lista de alertas se agregará aquí */}
                        <div className={styles.emptyState}>
                            No hay alertas recientes
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlertasRecientesWidget;