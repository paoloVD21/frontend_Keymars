import React from 'react';
import styles from './ProductosPorVencerWidget.module.css';

interface ProductosPorVencerWidgetProps {
    isLoading?: boolean;
}

const ProductosPorVencerWidget: React.FC<ProductosPorVencerWidgetProps> = ({
    isLoading = false
}) => {
    return (
        <div className={styles.widget}>
            <div className={styles.header}>
                <h3 className={styles.title}>Productos por Vencer</h3>
                <span className="material-icons">timer</span>
            </div>
            
            <div className={styles.content}>
                {isLoading ? (
                    <div className={styles.loading}>
                        <div className={styles.skeleton}></div>
                        <div className={styles.skeleton}></div>
                        <div className={styles.skeleton}></div>
                    </div>
                ) : (
                    <div className={styles.productosList}>
                        {/* Lista de productos se agregará aquí */}
                        <div className={styles.emptyState}>
                            No hay productos próximos a vencer
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductosPorVencerWidget;