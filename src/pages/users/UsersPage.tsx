import { UserList } from '../../components/users/UserList';
import styles from './UsersPage.module.css';

export const UsersPage = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Gestión de Usuarios</h1>
            
            <div className={styles.buttonContainer}>
                <button 
                    className={styles.registerButton}
                    onClick={() => {/* TODO: Implementar modal o navegación a formulario de registro */}}
                >
                    Registrar Usuario
                </button>
            </div>

            <div className={styles.tableContainer}>
                <UserList />
            </div>
        </div>
    );
};