import React from 'react';
import { SalidasList } from '../../components/salidas/SalidasList';
import styles from './SalidaPage.module.css';

export const SalidaPage: React.FC = () => {
    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.title}>Salidas</h1>
            <div className={styles.content}>
                <SalidasList />
            </div>
        </div>
    );
};