import React from 'react';
import { EntradasList } from '../../components/entradas/EntradasList';
import styles from './EntradaPage.module.css';

export const EntradaPage: React.FC = () => {
    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.title}>Entradas</h1>
            <div className={styles.content}>
                <EntradasList />
            </div>
        </div>
    );
};