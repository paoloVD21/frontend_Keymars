import { useEffect, useState } from 'react';
import type { User, GetUsersParams } from '../../types/user';
import { userService } from '../../services/userService';
import styles from './UserList.module.css';

export const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                            onClick={() => {/* Editar usuario */}}
                            className={styles.editButton}
                        >
                            Editar
                        </button>
                        <button 
                            onClick={() => userService.toggleUserStatus(user.id_usuario, !user.activo)}
                            className={user.activo ? styles.deactivateButton : styles.activateButton}
                        >
                            {user.activo ? 'Desactivar' : 'Activar'}
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
        </div>
    );
};