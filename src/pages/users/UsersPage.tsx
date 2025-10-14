import { useState } from 'react';
import { UserList } from '../../components/users/UserList';
import { CreateUserModal } from '../../components/users/CreateUserModal';
import styles from './UsersPage.module.css';

export const UsersPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleUserCreated = () => {
        // Recargar la lista de usuarios
        window.location.reload();
    };

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
                <UserList />
            </div>

            <CreateUserModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onUserCreated={handleUserCreated}
            />
        </div>
    );
};