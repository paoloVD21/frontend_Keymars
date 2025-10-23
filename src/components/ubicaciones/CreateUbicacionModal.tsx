import { useState } from 'react';
import styles from './CreateUbicacionModal.module.css';
import { ubicacionService } from '../../services/ubicacionService';
import type { CreateUbicacion } from '../../types/ubicacion';

interface CreateUbicacionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUbicacionCreated: () => void;
    id_sucursal: number;
    nombreSucursal: string;
}

export const CreateUbicacionModal = ({ 
    isOpen, 
    onClose, 
    onUbicacionCreated,
    id_sucursal,
    nombreSucursal
}: CreateUbicacionModalProps) => {
    const [formData, setFormData] = useState<CreateUbicacion>({
        nombre: '',
        id_sucursal: id_sucursal
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await ubicacionService.createUbicacion(formData);
            onUbicacionCreated();
            setFormData({ ...formData, nombre: '' });
            onClose();
        } catch (error) {
            console.error('Error al crear ubicación:', error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Error al crear la ubicación');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Nueva Ubicación</h2>
                <p className={styles.sucursalInfo}>
                    Sucursal: <span className={styles.sucursalName}>{nombreSucursal}</span>
                </p>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="nombre">
                            Nombre de la Ubicación
                        </label>
                        <input
                            id="nombre"
                            name="nombre"
                            type="text"
                            required
                            value={formData.nombre}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Ej: Almacén A, Estante 1, etc."
                        />
                    </div>

                    {error && <p className={styles.errorText}>{error}</p>}

                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={`${styles.button} ${styles.cancelButton}`}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={`${styles.button} ${styles.submitButton}`}
                            disabled={loading}
                        >
                            {loading ? 'Creando...' : 'Crear Ubicación'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};