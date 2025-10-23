import React, { useState, useEffect } from 'react';
import styles from './CreateEntradaModal.module.css';
import { entradaService } from '../../services/entradaService';
import { productoService } from '../../services/productoService';
import { proveedorService } from '../../services/proveedorService';
import { sucursalService } from '../../services/sucursalService';
import { ubicacionService } from '../../services/ubicacionService';
import type { EntradaCreate, ProductoEntrada } from '../../types/entrada';
import type { Producto } from '../../types/producto';
import type { Sucursal } from '../../types/sucursal';
import type { Ubicacion } from '../../types/ubicacion';

interface CreateEntradaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface ProductoSeleccionado extends ProductoEntrada {
    nombre: string;
    ubicacion_nombre?: string;
}

export const CreateEntradaModal: React.FC<CreateEntradaModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [proveedores, setProveedores] = useState<{ id_proveedor: number; nombre: string }[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
    const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null);
    const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);

    const [formData, setFormData] = useState<Partial<EntradaCreate>>({
        fecha: new Date().toISOString().split('T')[0],
        tipo_movimiento: 'INGRESO',
        cantidad_productos: 0,
        id_proveedor: undefined,
        id_usuario: 1, // Esto debería venir del contexto de autenticación
        id_sucursal: undefined,
        ubicaciones: [],
        productos: []
    });

    useEffect(() => {
        if (isOpen) {
            loadInitialData();
        }
    }, [isOpen]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const [proveedoresData, productosData, sucursalesData] = await Promise.all([
                proveedorService.getProveedores(),
                productoService.getProductos(),
                sucursalService.getSucursales()
            ]);

            setProveedores(proveedoresData.proveedores);
            setProductos(productosData.productos);
            setSucursales(sucursalesData.sucursales);
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
            setError('Error al cargar los datos necesarios');
        } finally {
            setLoading(false);
        }
    };

    const handleSucursalClick = async (id_sucursal: number) => {
        const selectedSuc = sucursales.find(s => s.id_sucursal === id_sucursal);
        if (!selectedSuc) return;

        try {
            setLoading(true);
            setSelectedSucursal(selectedSuc);
            setProductosSeleccionados([]); // Limpiar productos al cambiar de sucursal
            setError('');
            
            const response = await ubicacionService.getUbicacionesPorSucursal(id_sucursal);
            if (response?.ubicaciones) {
                const ubicacionesActivas = response.ubicaciones.filter(u => u.activo);
                if (ubicacionesActivas.length === 0) {
                    setError('Esta sucursal no tiene ubicaciones activas disponibles');
                } else {
                    setUbicaciones(ubicacionesActivas);
                }
            } else {
                setError('No se pudieron cargar las ubicaciones de esta sucursal');
            }

            setFormData(prev => ({
                ...prev,
                id_sucursal: id_sucursal,
                ubicaciones: []
            }));
        } catch (error) {
            console.error('Error al cargar ubicaciones:', error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Error al cargar las ubicaciones');
            }
            setUbicaciones([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProducto = (producto: Producto) => {
        if (!selectedSucursal) {
            setError('Por favor, seleccione primero una sucursal');
            return;
        }

        const nuevoProducto: ProductoSeleccionado = {
            id_producto: producto.id_producto,
            nombre: producto.nombre,
            cantidad: 1,
            precio_unitario: producto.precio || 0,
            id_ubicacion: 0
        };

        setProductosSeleccionados(prev => [...prev, nuevoProducto]);
        actualizarCantidadTotal([...productosSeleccionados, nuevoProducto]);
    };

    const handleRemoveProducto = (index: number) => {
        const nuevosProductos = productosSeleccionados.filter((_, i) => i !== index);
        setProductosSeleccionados(nuevosProductos);
        actualizarCantidadTotal(nuevosProductos);
    };

    const handleProductoChange = (index: number, campo: keyof ProductoSeleccionado, valor: number) => {
        const nuevosProductos = productosSeleccionados.map((producto, i) => {
            if (i === index) {
                return { ...producto, [campo]: valor };
            }
            return producto;
        });

        setProductosSeleccionados(nuevosProductos);
        if (campo === 'cantidad') {
            actualizarCantidadTotal(nuevosProductos);
        }
    };

    const actualizarCantidadTotal = (productos: ProductoSeleccionado[]) => {
        const cantidadTotal = productos.reduce((total, producto) => total + producto.cantidad, 0);
        setFormData(prev => ({ ...prev, cantidad_productos: cantidadTotal }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.id_sucursal) {
            setError('Por favor, seleccione una sucursal');
            return;
        }

        if (!formData.id_proveedor) {
            setError('Por favor, seleccione un proveedor');
            return;
        }

        if (productosSeleccionados.length === 0) {
            setError('Por favor, agregue al menos un producto');
            return;
        }

        // Validar que todos los productos tengan ubicación asignada
        const productosSinUbicacion = productosSeleccionados.some(p => !p.id_ubicacion);
        if (productosSinUbicacion) {
            setError('Todos los productos deben tener una ubicación asignada');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const productosLimpios = productosSeleccionados.map(({ id_producto, cantidad, precio_unitario, id_ubicacion }) => ({
                id_producto,
                cantidad,
                precio_unitario,
                id_ubicacion
            }));
            
            await entradaService.createEntrada({
                ...formData as EntradaCreate,
                productos: productosLimpios
            });

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error al crear entrada:', err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Error al crear la entrada');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Registrar Ingreso</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="fecha">
                            Fecha
                        </label>
                        <input
                            id="fecha"
                            type="date"
                            value={formData.fecha}
                            onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="id_proveedor">
                            Proveedor
                        </label>
                        <select
                            id="id_proveedor"
                            value={formData.id_proveedor || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, id_proveedor: Number(e.target.value) }))}
                            className={styles.select}
                            required
                        >
                            <option value="">Seleccione un proveedor</option>
                            {proveedores.map(proveedor => (
                                <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                                    {proveedor.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={`${styles.sucursalesSection} ${styles.fullWidth}`}>
                        <h3 className={styles.subtitle}>Seleccionar Sucursal</h3>
                        <div className={styles.sucursalList}>
                            {sucursales.map(sucursal => (
                                <div
                                    key={sucursal.id_sucursal}
                                    className={`${styles.sucursalCard} ${selectedSucursal?.id_sucursal === sucursal.id_sucursal ? styles.selected : ''}`}
                                    onClick={() => handleSucursalClick(sucursal.id_sucursal)}
                                >
                                    <h4>{sucursal.nombre}</h4>
                                </div>
                            ))}
                        </div>
                    </div>

                    {selectedSucursal && (
                        <div className={styles.productosSection}>
                            <h3 className={styles.subtitle}>Agregar Productos</h3>
                            <div className={styles.productSelector}>
                                <select
                                    className={styles.select}
                                    onChange={(e) => {
                                        const producto = productos.find(p => p.id_producto === Number(e.target.value));
                                        if (producto) {
                                            handleAddProducto(producto);
                                        }
                                    }}
                                    value=""
                                >
                                    <option value="">Seleccione un producto</option>
                                    {productos.map(producto => (
                                        <option key={producto.id_producto} value={producto.id_producto}>
                                            {producto.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {productosSeleccionados.length > 0 && (
                                <div className={styles.productosTable}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Cantidad</th>
                                                <th>Precio Unitario</th>
                                                <th>Ubicación</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productosSeleccionados.map((producto, index) => (
                                                <tr key={index}>
                                                    <td>{producto.nombre}</td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={producto.cantidad}
                                                            onChange={(e) => handleProductoChange(index, 'cantidad', Number(e.target.value))}
                                                            className={styles.input}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={producto.precio_unitario}
                                                            onChange={(e) => handleProductoChange(index, 'precio_unitario', Number(e.target.value))}
                                                            className={styles.input}
                                                        />
                                                    </td>
                                                    <td>
                                                        <select
                                                            value={producto.id_ubicacion || ''}
                                                            onChange={(e) => handleProductoChange(index, 'id_ubicacion', Number(e.target.value))}
                                                            className={styles.select}
                                                        >
                                                            <option value="">Seleccione ubicación</option>
                                                            {ubicaciones.map(ubicacion => (
                                                                <option key={ubicacion.id_ubicacion} value={ubicacion.id_ubicacion}>
                                                                    {ubicacion.nombre}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveProducto(index)}
                                                            className={styles.removeButton}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

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
                            {loading ? 'Guardando...' : 'Registrar Ingreso'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};