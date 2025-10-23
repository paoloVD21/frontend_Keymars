import React from 'react';
import { EntradasList } from '../../components/entradas/EntradasList';
import styles from './EntradaPage.module.css';

export const EntradaPage: React.FC = () => {
    return (
        <div className={styles.pageContainer}>
            <div className={styles.content}>
                <EntradasList />
            </div>
        </div>
    );
};