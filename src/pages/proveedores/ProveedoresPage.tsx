import { useState, useCallback } from 'react';
import { ProveedorList } from '../../components/proveedores/ProveedorList';
import { CreateProveedorModal } from '../../components/proveedores/CreateProveedorModal';
import { useAuthStore } from '../../store/authStore';
import styles from './ProveedoresPage.module.css';

export const ProveedoresPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shouldRefreshList, setShouldRefreshList] = useState(0);
    const { user, isLoading } = useAuthStore();

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

    // Debugging
    console.log('Estado de autenticación:', { isLoading, user });

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (!user) {
        console.log('No hay usuario autenticado');
        return <div>No tienes acceso a esta página</div>;
    }

    console.log('Usuario autenticado:', { email: user.email, role: user.role });

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Proveedores</h1>
            <h2 className={styles.subtitle}>Gestiona los Proveedores</h2>

            {user.role === 'supervisor' && (
                <div className={styles.buttonContainer}>
                    <button
                        className={styles.registerButton}
                        onClick={handleOpenModal}
                    >
                        Registrar Proveedor
                    </button>
                </div>
            )}

            <div className={styles.tableContainer}>
                <ProveedorList 
                    key={shouldRefreshList} 
                    onRefresh={handleListRefreshed}
                    userRole={user.role}
                />
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