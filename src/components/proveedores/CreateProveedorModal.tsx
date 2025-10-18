import { useState } from 'react';
import styles from './CreateProveedorModal.module.css';
import { proveedorService } from '../../services/proveedorService';

interface CreateProveedorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProveedorCreated: () => void;
}

export const CreateProveedorModal = ({ isOpen, onClose, onProveedorCreated }: CreateProveedorModalProps) => {
    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        telefono: '',
        email: '',
        activo: true
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            direccion: '',
            telefono: '',
            email: '',
            activo: true
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await proveedorService.createProveedor({
                ...formData,
                activo: true
            });
            onProveedorCreated();
            resetForm();
            onClose();
        } catch (error) {
            console.error('Error al crear proveedor:', error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Error al crear el proveedor');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Crear Nuevo Proveedor</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="nombre">
                            Nombre
                        </label>
                        <input
                            id="nombre"
                            name="nombre"
                            type="text"
                            required
                            value={formData.nombre}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="direccion">
                            Dirección
                        </label>
                        <textarea
                            id="direccion"
                            name="direccion"
                            required
                            value={formData.direccion}
                            onChange={handleChange}
                            className={styles.input}
                            rows={3}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="telefono">
                            Teléfono
                        </label>
                        <input
                            id="telefono"
                            name="telefono"
                            type="tel"
                            required
                            value={formData.telefono}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="email">
                            Correo
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.input}
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
                            {loading ? 'Creando...' : 'Crear Proveedor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};