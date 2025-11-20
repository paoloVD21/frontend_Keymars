import { useState, useEffect, useCallback } from 'react';
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

    const validateToken = (): boolean => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No hay sesión activa. Por favor, inicia sesión nuevamente.');
            return false;
        }
        return true;
    };

    const getResponseKey = (type: string): string => {
        if (type === 'proveedores') {
            return 'proveedores';
        }
        if (type === 'categorias') {
            return 'categorias';
        }
        return 'marcas';
    };

    const validateResponseData = useCallback((res: unknown, type: string): boolean => {
        const key = getResponseKey(type);
        if (res && typeof res === 'object' && key in res) {
            const data = res as Record<string, unknown>;
            if (Array.isArray(data[key])) {
                return true;
            }
        }
        throw new Error(`No se pudieron cargar los ${type} correctamente`);
    }, []);

    const handleDataResponse = useCallback((
        proveedoresRes: unknown,
        categoriasRes: unknown,
        marcasRes: unknown
    ): void => {
        validateResponseData(proveedoresRes, 'proveedores');
        validateResponseData(categoriasRes, 'categorias');
        validateResponseData(marcasRes, 'marcas');

        const proveedoresData = proveedoresRes as { proveedores: ProveedorSelect[] };
        const categoriasData = categoriasRes as { categorias: Categoria[] };
        const marcasData = marcasRes as { marcas: Marca[] };

        setProveedores(proveedoresData.proveedores);
        setCategorias(categoriasData.categorias);
        setMarcas(marcasData.marcas);
    }, [validateResponseData]);

    const handleLoadError = (error: unknown): void => {
        console.error('Error al cargar datos:', error);
        const message = error instanceof Error 
            ? error.message 
            : 'Error al cargar los datos necesarios. Por favor, intenta de nuevo.';
        setError(message);
    };

    useEffect(() => {
        const loadData = async () => {
            if (!isOpen && !shouldRefreshData) {
                return;
            }
            
            if (!validateToken()) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const [proveedoresRes, categoriasRes, marcasRes] = await Promise.all([
                    proveedorService.getProveedoresSimple(),
                    categoriaService.getCategorias(),
                    marcaService.getMarcas()
                ]);
                
                handleDataResponse(proveedoresRes, categoriasRes, marcasRes);
            } catch (error) {
                handleLoadError(error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [isOpen, shouldRefreshData, handleDataResponse]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let parsedValue: string | number | null = value;

        // Convertir a número si el campo lo requiere
        if (['precio', 'id_categoria', 'id_proveedor', 'stock_minimo'].includes(name)) {
            parsedValue = value === '' ? 0 : Number.parseFloat(value);
        } else if (name === 'id_marca') {
            parsedValue = value === '' ? null : Number.parseFloat(value);
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

    const validateFormData = (): void => {
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
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            validateFormData();
            await productoService.createProducto(formData);
            onProductCreated();
            resetForm();
            onClose();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al crear el producto';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const renderSelectField = (
        id: string,
        label: string,
        name: string,
        options: { id: string | number; nombre: string }[] | undefined,
        value: string | number | null,
        placeholder: string,
        emptyMessage?: string
    ) => (
        <div className={styles.formGroup}>
            <label className={styles.label} htmlFor={id}>
                {label}
            </label>
            <select
                id={id}
                name={name}
                required
                value={value || ''}
                onChange={handleChange}
                className={styles.select}
                disabled={loading}
            >
                <option value="">
                    {loading ? `Cargando ${placeholder}...` : `Seleccione ${placeholder}`}
                </option>
                {options && options.length > 0 ? (
                    options.map(option => (
                        <option key={option.id} value={option.id}>
                            {option.nombre}
                        </option>
                    ))
                ) : (
                    <option value="" disabled>
                        {emptyMessage || `No hay ${placeholder} disponibles`}
                    </option>
                )}
            </select>
        </div>
    );

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

                    {renderSelectField(
                        'id_categoria',
                        'Categoría',
                        'id_categoria',
                        categorias?.map(c => ({ id: c.id_categoria, nombre: c.nombre })),
                        formData.id_categoria,
                        'una categoría'
                    )}

                    {renderSelectField(
                        'id_marca',
                        'Marca',
                        'id_marca',
                        marcas?.map(m => ({ id: m.id_marca, nombre: m.nombre })),
                        formData.id_marca,
                        'una marca'
                    )}

                    {renderSelectField(
                        'id_proveedor',
                        'Proveedor',
                        'id_proveedor',
                        proveedores?.map(p => ({ id: p.id_proveedor, nombre: p.nombre || 'Proveedor sin nombre' })),
                        formData.id_proveedor,
                        'un proveedor',
                        'No hay proveedores disponibles'
                    )}

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