import { Link, useNavigate } from 'react-router-dom';
import type { User } from '../../types/auth';
import { useAuthStore } from '../../store/authStore';
import styles from './Sidebar.module.css';

interface SidebarProps {
    user: User | null;
}

export const Sidebar = ({ user }: SidebarProps) => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className={styles.sidebar}>
            <nav className={styles.navigation}>
                <Link to="/dashboard" className={styles.navLink}>
                    Dashboard
                </Link>
                <Link to="/productos" className={styles.navLink}>
                    Productos
                </Link>
                <Link to="/entradas" className={styles.navLink}>
                    Entradas
                </Link>
                <Link to="/salidas" className={styles.navLink}>
                    Salidas
                </Link>
                <Link to="/suppliers" className={styles.navLink}>
                    Proveedores
                </Link>
                <Link to="/alerts" className={styles.navLink}>
                    Alertas
                </Link>
                
                {/* Menú solo para supervisores */}
                {user?.role === 'supervisor' && (
                    <>
                        <Link to="/users" className={styles.navLink}>
                            Usuarios
                        </Link>
                        <Link to="/reportes" className={styles.navLink}>
                            Reportes
                        </Link>
                    </>
                )}
            </nav>

            {/* Botón de cerrar sesión */}
            <div className={styles.logoutContainer}>
                <button
                    onClick={handleLogout}
                    className={styles.logoutButton}
                >
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
};