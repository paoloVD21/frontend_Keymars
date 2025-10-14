import { useEffect, useState } from 'react';
import type { User, GetUsersParams } from '../../types/user';
import { userService } from '../../services/userService';
import { EditUserModal } from './EditUserModal';
import styles from './UserList.module.css';

export const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [loadingUserId, setLoadingUserId] = useState<number | null>(null);

    const loadUsers = async (params?: GetUsersParams) => {
        try {
            setLoading(true);
            const data = await userService.getUsers(params);
            setUsers(data.usuarios);
            setTotal(data.total);
            setError(null);
        } catch (err) {
            setError('Error al cargar usuarios');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const renderTableContent = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan={5} className={styles.messageCell}>
                        <div className={styles.loadingMessage}>
                            Cargando usuarios...
                        </div>
                    </td>
                </tr>
            );
        }

        if (error) {
            return (
                <tr>
                    <td colSpan={5} className={styles.messageCell}>
                        <div className={styles.errorMessage}>
                            {error}
                            <button 
                                onClick={() => loadUsers()}
                                className={styles.retryButton}
                            >
                                Reintentar
                            </button>
                        </div>
                    </td>
                </tr>
            );
        }

        if (users.length === 0) {
            return (
                <tr>
                    <td colSpan={5} className={styles.messageCell}>
                        <div className={styles.emptyMessage}>
                            No hay usuarios registrados
                        </div>
                    </td>
                </tr>
            );
        }

        return users.map(user => (
            <tr key={user.id_usuario} className={styles.tableRow}>
                <td className={styles.tableCell}>{user.nombre}</td>
                <td className={styles.tableCell}>{user.apellido}</td>
                <td className={styles.tableCell}>{user.email}</td>
                <td className={styles.tableCell}>
                    <span className={user.activo ? styles.statusActive : styles.statusInactive}>
                        {user.activo ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td className={styles.tableCell}>
                    <div className={styles.actions}>
                        <button 
                            onClick={() => {
                                setSelectedUser(user);
                                setIsEditModalOpen(true);
                            }}
                            className={styles.editButton}
                            disabled={loadingUserId === user.id_usuario}
                        >
                            Editar
                        </button>
                        <button 
                            onClick={async () => {
                                try {
                                    setLoadingUserId(user.id_usuario);
                                    setError(null);
                                    await userService.toggleUserStatus(user.id_usuario, !user.activo);
                                    await loadUsers(); // Recargar la lista
                                } catch (err) {
                                    console.error('Error al cambiar estado:', err);
                                    if (err instanceof Error) {
                                        setError(err.message);
                                    } else {
                                        setError('Error al cambiar el estado del usuario');
                                    }
                                } finally {
                                    setLoadingUserId(null);
                                }
                            }}
                            className={`${styles.statusButton} ${user.activo ? styles.deactivateButton : styles.activateButton}`}
                            disabled={loadingUserId === user.id_usuario}
                        >
                            {loadingUserId === user.id_usuario ? 'Procesando...' : 
                             user.activo ? 'Desactivar' : 'Activar'}
                        </button>
                    </div>
                </td>
            </tr>
        ));
    };

    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.tableHeader}>Nombre</th>
                        <th className={styles.tableHeader}>Apellido</th>
                        <th className={styles.tableHeader}>Email</th>
                        <th className={styles.tableHeader}>Estado</th>
                        <th className={styles.tableHeader}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableContent()}
                </tbody>
            </table>
            <div className={styles.footer}>
                Total de usuarios: {total}
            </div>

            {selectedUser && (
                <EditUserModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedUser(null);
                    }}
                    onUserUpdated={() => {
                        loadUsers();
                        setIsEditModalOpen(false);
                        setSelectedUser(null);
                    }}
                    user={selectedUser}
                />
            )}
        </div>
    );
};