import { Outlet } from 'react-router-dom';
import logoImage from '../assets/images/logo.png';
import { AppFooter } from '../components/ui/AppFooter';
import styles from './AuthLayout.module.css';

export const AuthLayout = () => {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.content}>
                    {/* Título principal */}
                    <div className={styles.titleContainer}>
                        <h1 className={styles.title}>
                            Inversiones y Representaciones
                        </h1>
                        <h2 className={styles.subtitle}>
                            Keymar's
                        </h2>
                    </div>

                    {/* Imagen del logo */}
                    <div className={styles.logoContainer}>
                        <img
                            className={styles.logo}
                            src={logoImage}
                            alt="Keymar's Logo"
                        />
                    </div>

                    {/* Sección del formulario */}
                    <div className={styles.formContainer}>
                        <Outlet />
                    </div>
                </div>
            </main>

            <AppFooter />
        </div>
    );
};