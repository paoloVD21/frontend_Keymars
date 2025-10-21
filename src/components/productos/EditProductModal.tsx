import React, { useState, useEffect } from 'react';
import styles from './EditProductModal.module.css';
import { productoService } from '../../services/productoService';
import type { Producto, ProductoUpdate } from '../../types/producto';

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (productoActualizado: Producto) => void;
    producto: Producto;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    producto
}) => {
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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (producto) {
            setFormData({
                nombre: producto.nombre,
                descripcion: producto.descripcion || '',
                codigo_producto: producto.codigo_producto,
                id_categoria: producto.id_categoria,
                id_marca: producto.id_marca,
                id_proveedor: producto.id_proveedor,
                precio: producto.precio,
                unidad_medida: producto.unidad_medida
            });
        }
    }, [producto]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const productoActualizado = await productoService.updateProducto(producto.id_producto, formData);
            onSuccess(productoActualizado);
            onClose();
        } catch (err) {
            console.error('Error al actualizar producto:', err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Error al actualizar el producto');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Editar Producto</h2>
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
                            value={formData.unidad_medida}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    {/* TODO: Agregar selectores para categoría, marca y proveedor */}

                    {error && <div className={styles.errorText}>{error}</div>}

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
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};