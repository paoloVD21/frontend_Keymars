import { useState, useCallback } from 'react';
import { ProductList } from '../../components/productos/ProductList';
import { CreateProductModal } from '../../components/productos/CreateProductModal';
import { useAuthStore } from '../../store/authStore';
import styles from './ProductosPage.module.css';

export const ProductosPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shouldRefreshList, setShouldRefreshList] = useState(0);
    const { user, isLoading } = useAuthStore();

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    // Callback para forzar la actualización de la lista de productos
    const handleProductCreated = () => {
        setShouldRefreshList(prev => prev + 1);
    };

    // Callback para controlar cuando se ha completado el refresh
    const handleListRefreshed = useCallback(() => {
        // Aquí podríamos agregar lógica adicional si es necesario
        console.log('Lista de productos actualizada');
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
            <h2 className={styles.subtitle}>Gestiona los Productos del sistema</h2>

            {user.role === 'supervisor' && (
                <div className={styles.buttonContainer}>
                    <button
                        className={styles.registerButton}
                        onClick={handleOpenModal}
                    >
                        Registrar Producto
                    </button>
                </div>
            )}

            <div className={styles.tableContainer}>
                <ProductList 
                    key={shouldRefreshList} 
                    onRefresh={handleListRefreshed}
                    userRole={user.role}
                />
            </div>

            <CreateProductModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onProductCreated={handleProductCreated}
            />
        </div>
    );
};