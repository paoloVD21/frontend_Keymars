import { useState, useCallback } from 'react';
import { ProductList } from '../../components/productos/ProductList';
import { CreateProductModal } from '../../components/productos/CreateProductModal';
import { useAuthStore } from '../../store/authStore';
import styles from './ProductosPage.module.css';

export const ProductosPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shouldRefreshList, setShouldRefreshList] = useState(0);
    const [shouldRefreshData, setShouldRefreshData] = useState(false);
    const { user, isLoading } = useAuthStore();

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setShouldRefreshData(false); // Resetear el indicador de recarga al cerrar el modal
    };

    // Callback para forzar la actualización de la lista de productos y datos relacionados
    const handleProductCreated = () => {
        setShouldRefreshList(prev => prev + 1);
        setShouldRefreshData(true); // Forzar la recarga de proveedores, categorías y marcas
    };

    // Callback para controlar cuando se ha completado el refresh
    const handleListRefreshed = useCallback(() => {
        // Aquí podríamos agregar lógica adicional si es necesario
    }, []);

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (!user) {
        console.log('No hay usuario autenticado');
        return <div>No tienes acceso a esta página</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Productos</h1>

            <div className={styles.buttonContainer}>
                <button
                    className={styles.registerButton}
                    onClick={handleOpenModal}
                >
                    Registrar Producto
                </button>
            </div>

            <div className={styles.tableContainer}>
                <ProductList 
                    key={shouldRefreshList} 
                    onRefresh={handleListRefreshed}
                />
            </div>

            <CreateProductModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onProductCreated={handleProductCreated}
                shouldRefreshData={shouldRefreshData}
            />
        </div>
    );
};