import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { MdDashboard, MdNotifications, MdAssessment, MdLogout } from 'react-icons/md';
import { FaShoppingCart, FaArrowCircleDown, FaArrowCircleUp, FaTruck, FaUsers } from 'react-icons/fa';
import logo from '../../assets/images/Logo-pequeño.png';
import { useAuthStore } from '../../store/authStore';
import type { User } from '../../types/auth';
import styles from './MobileNav.module.css';

interface MobileNavProps {
    user: User | null;
}

export const MobileNav = ({ user }: MobileNavProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    const menuItems = [
        { icon: <MdDashboard />, label: 'Dashboard', path: '/dashboard' },
        { icon: <FaShoppingCart />, label: 'Productos', path: '/productos' },
        { icon: <FaArrowCircleDown />, label: 'Entradas', path: '/entradas' },
        { icon: <FaArrowCircleUp />, label: 'Salidas', path: '/salidas' },
        { icon: <FaTruck />, label: 'Proveedores', path: '/suppliers' },
        { icon: <MdNotifications />, label: 'Alertas', path: '/alertas' },
        ...(user?.role === 'supervisor' ? [
            { icon: <FaUsers />, label: 'Usuarios', path: '/users' },
            { icon: <MdAssessment />, label: 'Reportes', path: '/reportes' }
        ] : [])
    ];

    return (
        <nav className={styles.mobileNav}>
            <div className={styles.navContent}>
                <button 
                    className={`${styles.menuButton} ${isMenuOpen ? styles.active : ''}`}
                    onClick={toggleMenu}
                    aria-label="Menú principal"
                >
                    {isMenuOpen ? (
                        <HiX size={24} color="white" />
                    ) : (
                        <HiMenu size={24} color="white" />
                    )}
                </button>
                <div className={styles.brandContainer}>
                    <img src={logo} alt="Logo Keymars" className={styles.logo} />
                    <p className={styles.title}>I y R Keymars</p>
                </div>
            </div>

            <div className={`${styles.dropdown} ${isMenuOpen ? styles.show : ''}`}>
                {menuItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className={styles.menuItem}
                        onClick={handleLinkClick}
                    >
                        <span className={styles.icon}>{item.icon}</span>
                        <span className={styles.text}>{item.label}</span>
                    </Link>
                ))}

                <button
                    onClick={handleLogout}
                    className={styles.logoutButton}
                >
                    <MdLogout className={styles.icon} />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </nav>
    );
};