import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { User } from '../../types/auth';
import { useAuthStore } from '../../store/authStore';
import { MdDashboard, MdNotifications, MdAssessment, MdLogout } from 'react-icons/md';
import { HiOutlineMenuAlt2, HiOutlineMenuAlt3 } from 'react-icons/hi';
import { FaShoppingCart, FaArrowCircleDown, FaArrowCircleUp, FaTruck, FaUsers } from 'react-icons/fa';
import styles from './Sidebar.module.css';

interface SidebarProps {
    user: User | null;
}

export const Sidebar = ({ user }: SidebarProps) => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const [isExpanded, setIsExpanded] = useState(true);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className={`${styles.sidebar} ${!isExpanded ? styles.collapsed : ''}`}>
            <div className={styles.header}>
                <div className={styles.logo}>
                    <img 
                        src="/Logo-pequeño.png" 
                        alt="Keymar's Logo" 
                        className={styles.logoImage} 
                    />
                    <div className={styles.brandContainer}>
                        <span className={styles.brandName}>I y R</span>
                        <span className={styles.brandTitle}>Keymar's</span>
                    </div>
                </div>
                <button 
                    className={styles.toggleButton} 
                    onClick={() => setIsExpanded(!isExpanded)}
                    title={isExpanded ? "Colapsar menú" : "Expandir menú"}
                >
                    {isExpanded ? <HiOutlineMenuAlt3 className={styles.icon} /> : <HiOutlineMenuAlt2 className={styles.icon} />}
                </button>
            </div>
            <nav className={styles.navigation}>
                <Link to="/dashboard" className={styles.navLink}>
                    <MdDashboard className={styles.icon} /> 
                    <span className={styles.navText}>Dashboard</span>
                </Link>
                <Link to="/productos" className={styles.navLink}>
                    <FaShoppingCart className={styles.icon} /> 
                    <span className={styles.navText}>Productos</span>
                </Link>
                <Link to="/entradas" className={styles.navLink}>
                    <FaArrowCircleDown className={styles.icon} /> 
                    <span className={styles.navText}>Entradas</span>
                </Link>
                <Link to="/salidas" className={styles.navLink}>
                    <FaArrowCircleUp className={styles.icon} /> 
                    <span className={styles.navText}>Salidas</span>
                </Link>
                <Link to="/suppliers" className={styles.navLink}>
                    <FaTruck className={styles.icon} /> 
                    <span className={styles.navText}>Proveedores</span>
                </Link>
                <Link to="/alertas" className={styles.navLink}>
                    <MdNotifications className={styles.icon} /> 
                    <span className={styles.navText}>Alertas</span>
                </Link>
                
                {/* Menú solo para supervisores */}
                {user?.role === 'supervisor' && (
                    <>
                        <Link to="/users" className={styles.navLink}>
                            <FaUsers className={styles.icon} /> 
                            <span className={styles.navText}>Usuarios</span>
                        </Link>
                        <Link to="/reportes" className={styles.navLink}>
                            <MdAssessment className={styles.icon} /> 
                            <span className={styles.navText}>Reportes</span>
                        </Link>
                    </>
                )}
            </nav>

            {/* Botón de cerrar sesión */}
            <div className={styles.logoutContainer}>
                <button
                    onClick={handleLogout}
                    className={styles.logoutButton}
                    title="Cerrar Sesión"
                >
                    <MdLogout className={styles.icon} /> 
                    <span className={styles.navText}>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
};