import type { FC } from 'react';
import styles from './AppFooter.module.css';

interface Props {
    className?: string;
}

export const AppFooter: FC<Props> = ({ className }) => {
    return (
        <footer className={styles.footer}>
            <div className={`${styles.footerContent} ${className || ''}`}>
                © {new Date().getFullYear()} Cao Systems E.I.R.L. Todos los derechos reservados.
            </div>
        </footer>
    );
};