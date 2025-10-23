import { useState, useEffect } from 'react';
import styles from './EditProductModal.module.css';
import { productoService } from '../../services/productoService';
import { categoriaService } from '../../services/categoriaService';
import { marcaService } from '../../services/marcaService';
import { proveedorService } from '../../services/proveedorService';
import type { Producto, ProductoUpdate } from '../../types/producto';
import type { Categoria } from '../../types/categoria';
import type { Marca } from '../../types/marca';

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (productoActualizado: Producto) => void;
    producto: Producto;
}

export const EditProductModal = ({
    isOpen,
    onClose,
    onSuccess,
    producto
}: EditProductModalProps): React.ReactElement | null => {
    const [formData, setFormData] = useState<ProductoUpdate>({
        nombre: '',
        descripcion: null,
        codigo_producto: '',
        id_categoria: 0,
        id_marca: null,
        id_proveedor: 0,
        precio: 0,
        unidad_medida: 'UNIDAD',
        stock_minimo: 0
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [proveedores, setProveedores] = useState<{ id_proveedor: number, nombre: string }[]>([]);

    // Efecto para inicializar el formulario cuando se abre el modal con un producto
    useEffect(() => {
        if (!producto || !isOpen) return;

        setFormData({
            nombre: producto.nombre,
            descripcion: producto.descripcion || null,
            codigo_producto: producto.codigo_producto,
            id_categoria: Number(producto.id_categoria),
            id_marca: producto.id_marca !== null ? Number(producto.id_marca) : null,
            id_proveedor: Number(producto.id_proveedor),
            precio: Number(producto.precio) || 0,
            unidad_medida: producto.unidad_medida,
            stock_minimo: Number(producto.stock_minimo) || 0
        });
    }, [producto, isOpen]);

    // Efecto para cargar los datos auxiliares cuando se abre el modal
    useEffect(() => {
        if (!isOpen) return;

        const loadCatalogData = async () => {
            try {
                setLoading(true);
                const [categoriasRes, marcasRes, proveedoresRes] = await Promise.all([
                    categoriaService.getCategorias(),
                    marcaService.getMarcas(),
                    proveedorService.getProveedoresSimple()
                ]);

                setCategorias(categoriasRes.categorias || []);
                setMarcas(marcasRes.marcas || []);
                const proveedoresData = proveedoresRes.proveedores || [];
                setProveedores(proveedoresData);
                
                // Buscar el id_proveedor basado en el nombre del proveedor
                if (producto && producto.proveedor_nombre) {
                    const proveedorEncontrado = proveedoresData.find(
                        prov => prov.nombre === producto.proveedor_nombre
                    );
                    if (proveedorEncontrado) {
                        setFormData(prev => ({
                            ...prev,
                            id_proveedor: proveedorEncontrado.id_proveedor
                        }));
                    }
                }
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setError('Error al cargar datos necesarios');
            } finally {
                setLoading(false);
            }
        };

        loadCatalogData();
    }, [isOpen, producto]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let parsedValue: string | number | null = value;

        if (['precio', 'id_categoria', 'id_proveedor', 'stock_minimo'].includes(name)) {
            parsedValue = value === '' ? 0 : parseFloat(value);
        } else if (name === 'id_marca') {
            parsedValue = value === '' ? null : parseFloat(value);
        } else if (name === 'descripcion') {
            parsedValue = value === '' ? null : value;
        }

        setFormData(prev => ({
            ...prev,
            [name]: parsedValue
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError(null);

            // Validaciones
            if (!formData.nombre.trim()) {
                throw new Error('El nombre es requerido');
            }
            if (!formData.codigo_producto.trim()) {
                throw new Error('El código de producto es requerido');
            }
            if (!formData.id_categoria || formData.id_categoria <= 0) {
                throw new Error('La categoría es requerida');
            }
            if (formData.precio < 0) {
                throw new Error('El precio no puede ser negativo');
            }
            if (formData.stock_minimo < 0) {
                throw new Error('El stock mínimo no puede ser negativo');
            }
            if (!formData.unidad_medida) {
                throw new Error('La unidad de medida es requerida');
            }

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
                            min="0"
                            required
                            value={formData.precio}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="stock_minimo">
                            Stock Mínimo
                        </label>
                        <input
                            id="stock_minimo"
                            name="stock_minimo"
                            type="number"
                            step="1"
                            min="0"
                            required
                            value={formData.stock_minimo}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="unidad_medida">
                            Unidad de Medida
                        </label>
                        <select
                            id="unidad_medida"
                            name="unidad_medida"
                            required
                            value={formData.unidad_medida}
                            onChange={handleChange}
                            className={styles.select}
                        >
                            <option value="">Seleccione una unidad de medida</option>
                            <option value="UNIDAD">UNIDAD</option>
                            <option value="KG">KG</option>
                            <option value="GRAMO">GRAMO</option>
                            <option value="LITRO">LITRO</option>
                            <option value="ML">ML</option>
                            <option value="METRO">METRO</option>
                            <option value="CM">CM</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="id_categoria">
                            Categoría
                        </label>
                        <select
                            id="id_categoria"
                            name="id_categoria"
                            required
                            value={formData.id_categoria || ''}
                            onChange={handleChange}
                            className={styles.select}
                        >
                            <option value="">Seleccione una categoría</option>
                            {categorias.map(categoria => (
                                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="id_marca">
                            Marca
                        </label>
                        <select
                            id="id_marca"
                            name="id_marca"
                            value={formData.id_marca || ''}
                            onChange={handleChange}
                            className={styles.select}
                        >
                            <option value="">Seleccione una marca</option>
                            {marcas.map(marca => (
                                <option key={marca.id_marca} value={marca.id_marca}>
                                    {marca.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="id_proveedor">
                            Proveedor
                        </label>
                        <select
                            id="id_proveedor"
                            name="id_proveedor"
                            required
                            value={formData.id_proveedor?.toString() || ''}
                            onChange={handleChange}
                            className={styles.select}
                        >
                            <option value="">Seleccione un proveedor</option>
                            {proveedores.map(proveedor => (
                                <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                                    {proveedor.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

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