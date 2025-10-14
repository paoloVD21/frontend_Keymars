import { useState, useCallback } from 'react';
import { UserList } from '../../components/users/UserList';
import { CreateUserModal } from '../../components/users/CreateUserModal';
import styles from './UsersPage.module.css';

export const UsersPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shouldRefreshList, setShouldRefreshList] = useState(0);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    // Callback para forzar la actualización de la lista de usuarios
    const handleUserCreated = () => {
        setShouldRefreshList(prev => prev + 1);
    };

    // Callback para controlar cuando se ha completado el refresh
    const handleListRefreshed = useCallback(() => {
        // Aquí podríamos agregar lógica adicional si es necesario
        console.log('Lista de usuarios actualizada');
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Usuarios</h1>
            
            <div className={styles.buttonContainer}>
                <button 
                    className={styles.registerButton}
                    onClick={handleOpenModal}
                >
                    Registrar Usuario
                </button>
            </div>

            <div className={styles.tableContainer}>
                <UserList key={shouldRefreshList} onRefresh={handleListRefreshed} />
            </div>

            <CreateUserModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onUserCreated={() => {
                    handleUserCreated();
                    handleCloseModal();
                }}/>
        </div>
    );
};