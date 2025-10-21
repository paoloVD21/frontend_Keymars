import { useState, useEffect } from 'react';
import styles from './CreateProductModal.module.css';
import { productoService } from '../../services/productoService';
import { categoriaService } from '../../services/categoriaService';
import { marcaService } from '../../services/marcaService';
import { proveedorService } from '../../services/proveedorService';
import type { ProductoUpdate } from '../../types/producto';
import type { Categoria } from '../../types/categoria';
import type { Marca } from '../../types/marca';
// Interfaz simplificada para el selector de proveedores
interface ProveedorSelect {
    id_proveedor: number;
    nombre: string;
}

interface CreateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProductCreated: () => void;
    // Indicador de que los datos de proveedores, categorías o marcas deben recargarse
    shouldRefreshData?: boolean;
}

export const CreateProductModal = ({ 
    isOpen, 
    onClose, 
    onProductCreated,
    shouldRefreshData = false 
}: CreateProductModalProps) => {
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
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [proveedores, setProveedores] = useState<ProveedorSelect[]>([]);

    useEffect(() => {
        const loadData = async () => {
            if (!isOpen && !shouldRefreshData) return;
            
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No hay sesión activa. Por favor, inicia sesión nuevamente.');
                    return;
                }

                const proveedoresRes = await proveedorService.getProveedoresSimple();

                if (proveedoresRes?.proveedores) {
                    setProveedores(proveedoresRes.proveedores);
                } else {
                    console.error('Respuesta de proveedores inválida:', proveedoresRes);
                    setError('Error: No se pudieron cargar los proveedores');
                }

                const [categoriasRes, marcasRes] = await Promise.all([
                    categoriaService.getCategorias(),
                    marcaService.getMarcas()
                ]);
                
                if (categoriasRes?.categorias) {
                    setCategorias(categoriasRes.categorias);
                }
                
                if (marcasRes?.marcas) {
                    setMarcas(marcasRes.marcas);
                }
            } catch (error) {
                console.error('Error al cargar datos:', error);
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Error al cargar los datos necesarios. Por favor, intenta de nuevo.');
                }
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [isOpen, shouldRefreshData]);

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
                        <select
                            id="unidad_medida"
                            name="unidad_medida"
                            required
                            value={formData.unidad_medida || ''}
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
                            disabled={loading}
                        >
                            <option value="">
                                {loading ? 'Cargando categorías...' : 'Seleccione una categoría'}
                            </option>
                            {categorias?.map(categoria => (
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
                            required
                            value={formData.id_marca || ''}
                            onChange={handleChange}
                            className={styles.select}
                            disabled={loading}
                        >
                            <option value="">
                                {loading ? 'Cargando marcas...' : 'Seleccione una marca'}
                            </option>
                            {marcas?.map(marca => (
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
                            value={formData.id_proveedor || ''}
                            onChange={handleChange}
                            className={styles.select}
                            disabled={loading}
                        >
                            <option value="">
                                {loading ? 'Cargando proveedores...' : 'Seleccione un proveedor'}
                            </option>
                            {proveedores?.map(proveedor => (
                                <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                                    {proveedor.nombre}
                                </option>
                            ))}
                        </select>
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
                            {loading ? 'Creando...' : 'Crear Producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};