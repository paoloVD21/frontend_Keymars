import { useState } from 'react';
import styles from './CreateProductModal.module.css';
import { productoService } from '../../services/productoService';
import type { ProductoUpdate } from '../../types/producto';

interface CreateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProductCreated: () => void;
}

export const CreateProductModal = ({ isOpen, onClose, onProductCreated }: CreateProductModalProps) => {
    const [formData, setFormData] = useState<ProductoUpdate>({
        nombre: '',
        descripcion: '',
        codigo_producto: '',
        id_categoria: undefined,
        id_marca: undefined,
        id_proveedor: undefined,
        precio: undefined,
        unidad_medida: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let parsedValue: string | number | undefined = value;

        // Convertir a número si el campo lo requiere
        if (['precio', 'id_categoria', 'id_marca', 'id_proveedor'].includes(name) && value !== '') {
            parsedValue = parseFloat(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: parsedValue || undefined
        }));
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            descripcion: '',
            codigo_producto: '',
            id_categoria: undefined,
            id_marca: undefined,
            id_proveedor: undefined,
            precio: undefined,
            unidad_medida: ''
        });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await productoService.createProducto(formData);
            onProductCreated();
            resetForm();
            onClose();
        } catch (error) {
            console.error('Error al crear producto:', error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Error al crear el producto');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Crear Nuevo Producto</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="codigo_producto">
                            Código
                        </label>
                        <input
                            id="codigo_producto"
                            name="codigo_producto"
                            type="text"
                            required
                            value={formData.codigo_producto}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

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
                        <label className={styles.label} htmlFor="descripcion">
                            Descripción
                        </label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={formData.descripcion || ''}
                            onChange={handleChange}
                            className={styles.input}
                            rows={3}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="precio">
                            Precio
                        </label>
                        <input
                            id="precio"
                            name="precio"
                            type="number"
                            step="0.01"
                            value={formData.precio || ''}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="unidad_medida">
                            Unidad de Medida
                        </label>
                        <input
                            id="unidad_medida"
                            name="unidad_medida"
                            type="text"
                            required
                            value={formData.unidad_medida || ''}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    {/* TODO: Agregar selectores para categoría, marca y proveedor */}

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
                            {loading ? 'Creando...' : 'Crear Producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};