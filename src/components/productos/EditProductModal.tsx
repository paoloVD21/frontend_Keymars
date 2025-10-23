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
    const [formData, setFormData] = useState<Omit<ProductoUpdate, 'id_proveedor'>>({
        nombre: '',
        descripcion: null,
        codigo_producto: '',
        id_categoria: 0,
        id_marca: null,
        precio: 0,
        unidad_medida: 'UNIDAD',
        stock_minimo: 0
    });

    // Estado eliminado ya que no se necesita
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [proveedores, setProveedores] = useState<{id_proveedor: number, nombre: string}[]>([]);
    // Se eliminaron los estados de sucursales y ubicaciones

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                
                // Cargar todos los datos necesarios en paralelo
                const [
                    categoriasData,
                    marcasData,
                    proveedoresData
                ] = await Promise.all([
                    categoriaService.getCategorias(),
                    marcaService.getMarcas(),
                    proveedorService.getProveedores()
                ]);

                // Establecer los datos básicos
                setCategorias(categoriasData.categorias);
                setMarcas(marcasData.marcas);
                setProveedores(proveedoresData.proveedores);
            } catch {
                setError('Error al cargar datos necesarios');
            } finally {
                setLoading(false);
            }
        };

        if (producto) {
            // Asegurarnos de que el id_proveedor sea un número
            const proveedorIdNumber = Number(producto.id_proveedor);
            if (isNaN(proveedorIdNumber)) {
                setError('Error: ID de proveedor inválido');
                return;
            }
            
            const initialData = {
                nombre: producto.nombre,
                descripcion: producto.descripcion || null,
                codigo_producto: producto.codigo_producto,
                id_categoria: producto.id_categoria,
                id_marca: producto.id_marca,
                precio: Number(producto.precio) || 0,
                unidad_medida: producto.unidad_medida,
                stock_minimo: Number(producto.stock_minimo) || 0
            };
            setFormData(initialData);
            loadData();
        }
    }, [producto]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            setError(null);

            // Asegurarnos de que el id_proveedor sea un número válido
            const id_proveedor = Number(producto.id_proveedor);

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

            // Verificar que tengamos un proveedor válido
            if (isNaN(id_proveedor) || id_proveedor <= 0) {
                throw new Error('ID de proveedor no válido');
            }

            // Construir el objeto de manera explícita
            const dataToSubmit: ProductoUpdate = {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                codigo_producto: formData.codigo_producto,
                id_categoria: formData.id_categoria,
                id_marca: formData.id_marca,
                precio: formData.precio,
                unidad_medida: formData.unidad_medida,
                stock_minimo: formData.stock_minimo,
                id_proveedor // Asegurarnos de que id_proveedor esté incluido
            };

            // Validación del objeto completo
            const camposRequeridos = ['nombre', 'codigo_producto', 'id_categoria', 'id_proveedor', 'precio', 'unidad_medida', 'stock_minimo'];
            const camposFaltantes = camposRequeridos.filter(campo => !dataToSubmit[campo as keyof ProductoUpdate]);
            
            if (camposFaltantes.length > 0) {
                throw new Error(`Campos requeridos faltantes: ${camposFaltantes.join(', ')}`);
            }

            const productoActualizado = await productoService.updateProducto(producto.id_producto, dataToSubmit);
            onSuccess(productoActualizado);
            onClose();
        } catch (err) {

            
            // Tipado más específico para errores de Axios
            interface AxiosErrorResponse {
                detail?: string;
                message?: string;
                [key: string]: unknown;
            }

            interface AxiosError {
                response?: {
                    status: number;
                    statusText: string;
                    data: AxiosErrorResponse;
                    headers: Record<string, string>;
                };
                config?: {
                    url?: string;
                    method?: string;
                    data?: string | Record<string, unknown>;
                };
                message: string;
            }

            // Si es un error de Axios, mostrar los detalles con mejor tipado
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as AxiosError;

                
                // Mostrar mensaje específico del error
                if (axiosError.response?.data?.detail) {
                    setError(`Error del servidor: ${JSON.stringify(axiosError.response.data.detail)}`);
                    return;
                }
            }
            
            // Si es un error estándar
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(`Error al actualizar el producto: ${JSON.stringify(err)}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // Se eliminaron las funciones relacionadas con sucursales y ubicaciones

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
                        <div className={styles.input}>
                            {proveedores.find(p => p.id_proveedor === producto.id_proveedor)?.nombre || 'Proveedor no encontrado'}
                        </div>
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