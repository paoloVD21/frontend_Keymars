import React, { useState, useEffect } from 'react';
import styles from './ModalEditarProveedor.module.css';
import { proveedorService } from '../../services/proveedorService';
import type { Proveedor, ProveedorUpdate } from '../../types/proveedor';

interface EditProveedorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (proveedorActualizado: Proveedor) => void;
    proveedor: Proveedor;
}

export const EditProveedorModal: React.FC<EditProveedorModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    proveedor
}) => {
    const [formData, setFormData] = useState<ProveedorUpdate>({
        nombre: '',
        contacto: '',
        email: '',
        telefono: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (proveedor) {
            setFormData({
                nombre: proveedor.nombre,
                contacto: proveedor.contacto,
                email: proveedor.email,
                telefono: proveedor.telefono
            });
        }
    }, [proveedor]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const proveedorActualizado = await proveedorService.updateProveedor(proveedor.id_proveedor, formData);
            onSuccess(proveedorActualizado);
            onClose();
        } catch (err) {
            console.error('Error al actualizar proveedor:', err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Error al actualizar el proveedor');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Editar Proveedor</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="nombre" className={styles.label}>Nombre:</label>
                        <input
                            type="text"
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="contacto" className={styles.label}>Contacto:</label>
                        <input
                            type="text"
                            id="contacto"
                            value={formData.contacto}
                            onChange={(e) => setFormData(prev => ({ ...prev, contacto: e.target.value }))}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="telefono" className={styles.label}>Teléfono:</label>
                        <input
                            type="tel"
                            id="telefono"
                            value={formData.telefono}
                            onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                            className={styles.input}
                            required
                        />
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelButton}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};