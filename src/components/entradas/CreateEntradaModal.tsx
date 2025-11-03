import React, { useState, useEffect } from 'react';
import styles from './CreateEntradaModal.module.css';
import { entradaService } from '../../services/entradaService';
import { productoService } from '../../services/productoService';
import { proveedorService } from '../../services/proveedorService';
import { sucursalService } from '../../services/sucursalService';
import { ubicacionService } from '../../services/ubicacionService';
import type { EntradaCreate, DetalleEntrada } from '../../types/entrada';
import type { Producto } from '../../types/producto';
import type { Sucursal } from '../../types/sucursal';
import type { Ubicacion, CreateUbicacion } from '../../types/ubicacion';
import type { Motivo } from '../../types/motivo';
import { motivoService } from '../../services/motivoService';

interface CreateEntradaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface ProductoSeleccionado extends DetalleEntrada {
    nombre: string;
    ubicacion_nombre?: string;
    precio_unitario?: number;
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
    const [motivos, setMotivos] = useState<Motivo[]>([]);
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
    const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null);
    const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);
    const [showNewUbicacionInput, setShowNewUbicacionInput] = useState(false);
    const [newUbicacionData, setNewUbicacionData] = useState<CreateUbicacion>({
        nombre: '',
        codigo_ubicacion: '',
        tipo_ubicacion: '',
        id_sucursal: 0
    });

    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [idProveedor, setIdProveedor] = useState<number>();

    const [formData, setFormData] = useState<Partial<EntradaCreate>>({
        id_motivo: undefined,
        id_sucursal: undefined,
        observacion: '',
        detalles: []
    });

    const resetForm = () => {
        setFormData({
            id_motivo: undefined,
            id_sucursal: undefined,
            observacion: '',
            detalles: []
        });
        setFecha(new Date().toISOString().split('T')[0]);
        setIdProveedor(undefined);
        setSelectedSucursal(null);
        setProductosSeleccionados([]);
        setError(null);
        setUbicaciones([]);
    };

    useEffect(() => {
        if (isOpen) {
            resetForm();
            loadInitialData();
        }
    }, [isOpen]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const [proveedoresData, productosData, sucursalesData, motivosEntrada] = await Promise.all([
                proveedorService.getProveedores(),
                productoService.getProductos(),
                sucursalService.getSucursales(),
                motivoService.getMotivosEntrada()
            ]);

            setProveedores(proveedoresData.proveedores);
            setProductos(productosData.productos);
            setSucursales(sucursalesData.sucursales);
            setMotivos(motivosEntrada);
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
            setError('Error al cargar los datos necesarios');
        } finally {
            setLoading(false);
        }
    };

    const isValidUbicacion = () => {
        return (
            newUbicacionData.nombre.trim() !== '' &&
            newUbicacionData.codigo_ubicacion.trim() !== '' &&
            newUbicacionData.tipo_ubicacion !== '' &&
            selectedSucursal !== null
        );
    };

    const resetNewUbicacionForm = () => {
        setNewUbicacionData({
            nombre: '',
            codigo_ubicacion: '',
            tipo_ubicacion: '',
            id_sucursal: 0
        });
    };

    const handleCreateUbicacion = async () => {
        if (!selectedSucursal || !isValidUbicacion()) return;
        
        try {
            setLoading(true);
            setError(null);
            
            await ubicacionService.createUbicacion({
                ...newUbicacionData,
                id_sucursal: selectedSucursal.id_sucursal
            });
            
            // Recargar ubicaciones
            const response = await ubicacionService.getUbicacionesPorSucursal(selectedSucursal.id_sucursal);
            if (response?.ubicaciones) {
                setUbicaciones(response.ubicaciones.filter(u => u.activo));
            }
            
            // Limpiar el formulario
            resetNewUbicacionForm();
            setShowNewUbicacionInput(false);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Error al crear la ubicación');
            }
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

            if (!response) {
                setError('No se pudieron cargar las ubicaciones de esta sucursal');
                return;
            }

            if (!response.ubicaciones) {
                setError('No se pudieron cargar las ubicaciones de esta sucursal');
                return;
            }

            const ubicacionesActivas = response.ubicaciones.filter(u => u.activo);
            
            setUbicaciones(ubicacionesActivas);
            
            if (ubicacionesActivas.length === 0) {
                setError('Esta sucursal no tiene ubicaciones activas disponibles');
            }

            setFormData(prev => ({
                ...prev,
                id_sucursal: id_sucursal
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

        if (!idProveedor) {
            setError('Por favor, seleccione un proveedor');
            return;
        }

        if (!formData.id_motivo) {
            setError('Por favor, seleccione un motivo de ingreso');
            return;
        }

        if (productosSeleccionados.length === 0) {
            setError('Por favor, agregue al menos un producto');
            return;
        }

        // Validar que todos los productos tengan ubicación asignada y cantidad positiva
        const productosSinUbicacion = productosSeleccionados.some(p => !p.id_ubicacion);
        if (productosSinUbicacion) {
            setError('Todos los productos deben tener una ubicación asignada');
            return;
        }

        const productosCantidadInvalida = productosSeleccionados.some(p => p.cantidad <= 0);
        if (productosCantidadInvalida) {
            setError('La cantidad debe ser mayor a 0 para todos los productos');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const detalles = productosSeleccionados.map(({ id_producto, cantidad, id_ubicacion }) => ({
                id_producto,
                id_ubicacion,
                cantidad
            }));

            const entrada = {
                id_motivo: formData.id_motivo,
                id_sucursal: formData.id_sucursal,
                id_proveedor: idProveedor,
                observacion: formData.observacion || '',
                detalles: detalles
            };

            await entradaService.registrarIngreso(entrada);

            resetForm();
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error al crear entrada:', err);
            if (err instanceof Error) {
                if (err.message === 'No se encontró información del usuario' || err.message === 'ID de usuario no encontrado') {
                    setError('Sesión no válida. Por favor, inicie sesión nuevamente.');
                } else {
                    setError(err.message);
                }
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
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
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
                            value={idProveedor || ''}
                            onChange={(e) => setIdProveedor(Number(e.target.value))}
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

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="id_motivo">
                            Motivo de Ingreso
                        </label>
                        <select
                            id="id_motivo"
                            value={formData.id_motivo || ''}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                id_motivo: Number(e.target.value)
                            }))}
                            className={styles.select}
                            required
                        >
                            <option value="">Seleccione un motivo</option>
                            {motivos.map(motivo => (
                                <option key={motivo.id_motivo} value={motivo.id_motivo}>
                                    {motivo.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="observacion">
                            Observación
                        </label>
                        <textarea
                            id="observacion"
                            value={formData.observacion || ''}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                observacion: e.target.value
                            }))}
                            className={`${styles.input} ${styles.textarea}`}
                            placeholder="Ingrese observaciones adicionales..."
                            rows={3}
                        />
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
                            <div className={styles.sectionHeader}>
                                <h3 className={styles.subtitle}>Agregar Productos</h3>
                                <button
                                    type="button"
                                    onClick={() => setShowNewUbicacionInput(true)}
                                    className={styles.addButton}
                                >
                                    + Nueva Ubicación
                                </button>
                            </div>

                            {showNewUbicacionInput && (
                                <div className={styles.modalOverlay}>
                                    <div className={`${styles.modalContent} ${styles.smallModal}`}>
                                        <h2 className={styles.modalTitle}>Nueva Ubicación</h2>
                                        <div className={styles.newUbicacionForm}>
                                            <div className={styles.formInputs}>
                                                <div className={styles.formGroup}>
                                                    <label className={styles.label}>Nombre</label>
                                                    <input
                                                        type="text"
                                                        value={newUbicacionData.nombre}
                                                        onChange={(e) => setNewUbicacionData((prev: CreateUbicacion) => ({
                                                            ...prev,
                                                            nombre: e.target.value
                                                        }))}
                                                        placeholder="Nombre de la ubicación"
                                                        className={styles.input}
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label className={styles.label}>Código</label>
                                                    <input
                                                        type="text"
                                                        value={newUbicacionData.codigo_ubicacion}
                                                        onChange={(e) => setNewUbicacionData((prev: CreateUbicacion) => ({
                                                            ...prev,
                                                            codigo_ubicacion: e.target.value
                                                        }))}
                                                        placeholder="Código (ej: EST-A1)"
                                                        className={styles.input}
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label className={styles.label}>Tipo de Ubicación</label>
                                                    <select
                                                        value={newUbicacionData.tipo_ubicacion}
                                                        onChange={(e) => setNewUbicacionData((prev: CreateUbicacion) => ({
                                                            ...prev,
                                                            tipo_ubicacion: e.target.value as CreateUbicacion['tipo_ubicacion']
                                                        }))}
                                                        className={styles.select}
                                                        required
                                                    >
                                                        <option value="">Seleccione un tipo</option>
                                                        <option value="ESTANTERIA">Estantería</option>
                                                        <option value="REFRIGERADO">Refrigerado</option>
                                                        <option value="SECO">Seco</option>
                                                        <option value="LIQUIDOS">Líquidos</option>
                                                        <option value="OTROS">Otros</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={styles.formButtons}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowNewUbicacionInput(false);
                                                        resetNewUbicacionForm();
                                                    }}
                                                    className={styles.cancelButton}
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleCreateUbicacion}
                                                    className={styles.saveButton}
                                                    disabled={!isValidUbicacion() || loading}
                                                >
                                                    {loading ? 'Guardando...' : 'Guardar'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

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
                            onClick={() => {
                                resetForm();
                                onClose();
                            }}
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