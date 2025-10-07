import { Link } from 'react-router-dom';
import type { User } from '../../types/auth';
import styles from './Sidebar.module.css';

interface SidebarProps {
    user: User | null;
}

export const Sidebar = ({ user }: SidebarProps) => {
    return (
        <aside className={styles.sidebar}>
            <nav className={styles.navigation}>
                <Link to="/dashboard" className={styles.navLink}>
                    Dashboard
                </Link>
                <Link to="/products" className={styles.navLink}>
                    Productos
                </Link>
                <Link to="/inventory" className={styles.navLink}>
                    Inventario
                </Link>
                <Link to="/suppliers" className={styles.navLink}>
                    Proveedores
                </Link>
                <Link to="/alerts" className={styles.navLink}>
                    Alertas
                </Link>
                
                {/* Menú solo para supervisores */}
                {user?.role === 'Supervisor' && (
                    <>
                        <Link to="/users" className={styles.navLink}>
                            Usuarios
                        </Link>
                        <Link to="/reports" className={styles.navLink}>
                            Reportes
                        </Link>
                    </>
                )}
            </nav>
        </aside>
    );
};