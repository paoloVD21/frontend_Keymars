import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { isAxiosError } from 'axios';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (error) {
            if (isAxiosError(error)) {
                console.error('Error de servidor:', error.response?.data);
            } else {
                console.error('Error inesperado:', error);
            }
        }
    };

    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="email">
                        Correo Electrónico
                    </label>
                    <div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.inputField}
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password">
                        Contraseña
                    </label>
                    <div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.inputField}
                        />
                    </div>
                </div>

                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={styles.submitButton}
                    >
                        {isLoading ? (
                            <span className={styles.loadingSpinner}>
                                <svg className={styles.spinnerIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Iniciando sesión...
                            </span>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};