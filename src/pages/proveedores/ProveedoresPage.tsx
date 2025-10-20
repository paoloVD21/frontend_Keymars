import { useState, useCallback } from 'react';
import { ProveedorList } from '../../components/proveedores/ProveedorList';
import { CreateProveedorModal } from '../../components/proveedores/CreateProveedorModal';
import styles from './ProveedoresPage.module.css';

export const ProveedoresPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shouldRefreshList, setShouldRefreshList] = useState(0);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    // Callback para forzar la actualización de la lista de proveedores
    const handleProveedorCreated = () => {
        setShouldRefreshList(prev => prev + 1);
    };

    // Callback para controlar cuando se ha completado el refresh
    const handleListRefreshed = useCallback(() => {
        // Aquí podríamos agregar lógica adicional si es necesario
        console.log('Lista de proveedores actualizada');
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Proveedores</h1>
            <h2>Gestiona los Proveedores del sistema</h2>

            <div className={styles.buttonContainer}>
                <button
                    className={styles.registerButton}
                    onClick={handleOpenModal}
                >
                    Registrar Proveedor
                </button>
            </div>

            <div className={styles.tableContainer}>
                <ProveedorList key={shouldRefreshList} onRefresh={handleListRefreshed} />
            </div>

            <CreateProveedorModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onProveedorCreated={() => {
                    handleProveedorCreated();
                    handleCloseModal();
                }} />
        </div>
    );
};