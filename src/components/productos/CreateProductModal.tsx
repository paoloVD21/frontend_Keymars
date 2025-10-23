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
    const [error, setError] = useState('');
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [proveedores, setProveedores] = useState<ProveedorSelect[]>([]);
    // Se eliminaron los estados de sucursales y ubicaciones

    useEffect(() => {
        console.log('🔄 [CreateProductModal] useEffect triggered:', { isOpen, shouldRefreshData });
        
        const loadData = async () => {
            if (!isOpen && !shouldRefreshData) {
                console.log('⏭️ [CreateProductModal] Skipping data load:', { isOpen, shouldRefreshData });
                return;
            }
            
            console.log('🚀 [CreateProductModal] Iniciando carga de datos...');
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('❌ [CreateProductModal] No token found');
                    setError('No hay sesión activa. Por favor, inicia sesión nuevamente.');
                    return;
                }

                console.log('🔄 [CreateProductModal] Iniciando carga de datos...');
                
                const [proveedoresRes, categoriasRes, marcasRes] = await Promise.all([
                    proveedorService.getProveedoresSimple(),
                    categoriaService.getCategorias(),
                    marcaService.getMarcas()
                ]);

                console.log('📥 [CreateProductModal] Datos recibidos:', { 
                    proveedores: proveedoresRes, 
                    categorias: categoriasRes, 
                    marcas: marcasRes 
                });
                
                if (proveedoresRes?.proveedores && Array.isArray(proveedoresRes.proveedores)) {
                    console.log('✅ [CreateProductModal] Proveedores cargados:', proveedoresRes.proveedores.length);
                    setProveedores(proveedoresRes.proveedores);
                } else {
                    console.error('❌ [CreateProductModal] Respuesta de proveedores inválida:', proveedoresRes);
                    throw new Error('No se pudieron cargar los proveedores correctamente');
                }

                if (categoriasRes?.categorias && Array.isArray(categoriasRes.categorias)) {
                    console.log('✅ [CreateProductModal] Categorías cargadas:', categoriasRes.categorias.length);
                    setCategorias(categoriasRes.categorias);
                } else {
                    console.error('❌ [CreateProductModal] Respuesta de categorías inválida:', categoriasRes);
                    throw new Error('No se pudieron cargar las categorías correctamente');
                }
                
                if (marcasRes?.marcas && Array.isArray(marcasRes.marcas)) {
                    console.log('✅ [CreateProductModal] Marcas cargadas:', marcasRes.marcas.length);
                    setMarcas(marcasRes.marcas);
                } else {
                    console.error('❌ [CreateProductModal] Respuesta de marcas inválida:', marcasRes);
                    throw new Error('No se pudieron cargar las marcas correctamente');
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
        let parsedValue: string | number | null = value;

        // Convertir a número si el campo lo requiere
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

    const resetForm = () => {
        setFormData({
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
        setError('');
    };

    // Se eliminaron las funciones relacionadas con sucursales y ubicaciones

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
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
            if (!formData.id_proveedor || formData.id_proveedor <= 0) {
                throw new Error('El proveedor es requerido');
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
                            {proveedores && proveedores.length > 0 ? (
                                proveedores.map(proveedor => (
                                    <option 
                                        key={proveedor.id_proveedor} 
                                        value={proveedor.id_proveedor}
                                    >
                                        {proveedor.nombre || 'Proveedor sin nombre'}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>
                                    No hay proveedores disponibles
                                </option>
                            )}
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