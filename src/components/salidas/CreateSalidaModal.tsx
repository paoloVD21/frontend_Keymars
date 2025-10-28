import React, { useState, useEffect } from 'react';
import styles from './CreateSalidaModal.module.css';
import { salidaService } from '../../services/salidaService';
import { sucursalService } from '../../services/sucursalService';
import { ubicacionService } from '../../services/ubicacionService';
import { motivoService } from '../../services/motivoService';
import type { SalidaCreate, DetalleSalida } from '../../types/salida';
import type { Sucursal } from '../../types/sucursal';
import type { Ubicacion } from '../../types/ubicacion';
import type { Motivo } from '../../types/motivo';

interface ProductoBusqueda {
    id_producto: number;
    nombre_producto: string;
    codigo_producto: string;
    precio: number;
    stock_ubicaciones: {
        id_ubicacion: number;
        nombre_ubicacion: string;
        stock_actual: number;
    }[];
}

interface CreateSalidaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface ProductoSeleccionado extends DetalleSalida {
    nombre: string;
    ubicacion_nombre?: string;
}

interface State {
    searchTerm: string;
    searchResults: ProductoBusqueda[];
    sucursales: Sucursal[];
    motivos: Motivo[];
    ubicaciones: Ubicacion[];
    loading: boolean;
    error: string | null;
    productosSeleccionados: ProductoSeleccionado[];
    fecha: string;
    formData: Partial<SalidaCreate>;
    tempSearchTerm: string;
}

export const CreateSalidaModal: React.FC<CreateSalidaModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [state, setState] = useState<State>({
        searchTerm: '',
        tempSearchTerm: '',
        searchResults: [],
        sucursales: [],
        motivos: [],
        ubicaciones: [],
        loading: false,
        error: null,
        productosSeleccionados: [],
        fecha: new Date().toISOString().split('T')[0],
        formData: {
            id_motivo: undefined,
            id_sucursal: undefined,
            observacion: '',
            detalles: []
        }
    });

    const resetForm = () => {
        setState({
            searchTerm: '',
            tempSearchTerm: '',
            searchResults: [],
            sucursales: [],
            motivos: [],
            ubicaciones: [],
            loading: false,
            error: null,
            productosSeleccionados: [],
            fecha: new Date().toISOString().split('T')[0],
            formData: {
                id_motivo: undefined,
                id_sucursal: undefined,
                observacion: '',
                detalles: []
            }
        });
    };

    const updateState = (updates: Partial<State>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                updateState({ loading: true });
                const [sucursalesData, motivosSalida] = await Promise.all([
                    sucursalService.getSucursales(),
                    motivoService.getMotivosSalida()
                ]);

                updateState({
                    sucursales: sucursalesData.sucursales,
                    motivos: motivosSalida,
                    loading: false
                });
            } catch (error) {
                console.error('Error al cargar datos iniciales:', error);
                updateState({
                    error: 'Error al cargar los datos necesarios',
                    loading: false
                });
            }
        };

        if (isOpen) {
            resetForm();
            loadInitialData();
        }
    }, [isOpen]);



    const handleSearch = async () => {
        if (!state.tempSearchTerm || state.tempSearchTerm.length < 3 || !state.formData.id_sucursal) {
            updateState({ 
                error: 'Ingrese al menos 3 caracteres para buscar y seleccione una sucursal',
                searchResults: [] 
            });
            return;
        }

        try {
            updateState({ loading: true, error: null });

            // Cargar las ubicaciones si aún no están cargadas
            if (state.ubicaciones.length === 0) {
                const ubicacionesData = await ubicacionService.getUbicacionesPorSucursal(state.formData.id_sucursal);
                if (!ubicacionesData || !ubicacionesData.ubicaciones) {
                    throw new Error('No se pudieron cargar las ubicaciones');
                }
                const ubicacionesActivas = ubicacionesData.ubicaciones.filter(u => u.activo);
                if (ubicacionesActivas.length === 0) {
                    throw new Error('Esta sucursal no tiene ubicaciones activas disponibles');
                }
                updateState({
                    ubicaciones: ubicacionesActivas
                });
            }

            // Buscar productos
            const response = await fetch(
                `http://localhost:8000/api/movements/productos/buscar/${state.formData.id_sucursal}?buscar=${encodeURIComponent(state.tempSearchTerm)}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Error al buscar productos');
            }

            const productos: ProductoBusqueda[] = await response.json();

            updateState({
                searchResults: productos,
                searchTerm: state.tempSearchTerm,
                loading: false
            });
        } catch (error) {
            console.error('Error al buscar productos:', error);
            updateState({
                error: 'Error al buscar productos',
                loading: false,
                searchResults: []
            });
        }
    };

    const handleSucursalChange = (sucursalId: number) => {
        updateState({
            formData: { ...state.formData, id_sucursal: sucursalId },
            productosSeleccionados: [], // Limpiar productos al cambiar de sucursal
            searchResults: [], // Limpiar resultados de búsqueda
            tempSearchTerm: '', // Limpiar término de búsqueda
            error: null
        });
    };

    const handleProductoSelect = (producto: ProductoBusqueda) => {
        const productoExistente = state.productosSeleccionados.find(
            (p: ProductoSeleccionado) => p.id_producto === producto.id_producto
        );
        
        if (productoExistente) {
            updateState({
                error: 'Este producto ya ha sido seleccionado'
            });
            return;
        }

        updateState({
            productosSeleccionados: [...state.productosSeleccionados, {
                id_producto: producto.id_producto,
                nombre: producto.nombre_producto,
                cantidad: 1,
                id_ubicacion: 0
            }],
            searchTerm: '',
            searchResults: [],
            error: null
        });
    };

    const handleRemoveProducto = (index: number) => {
        updateState({
            productosSeleccionados: state.productosSeleccionados.filter((_, i) => i !== index)
        });
    };

    const handleProductoChange = (
        index: number,
        campo: keyof Pick<ProductoSeleccionado, 'cantidad' | 'id_ubicacion'>,
        valor: number
    ) => {
        const nuevosProductos = state.productosSeleccionados.map((producto, i) => {
            if (i === index) {
                if (campo === 'id_ubicacion') {
                    const ubicacion = state.ubicaciones.find(u => u.id_ubicacion === valor);
                    return {
                        ...producto,
                        [campo]: valor,
                        ubicacion_nombre: ubicacion?.nombre
                    };
                }
                return { ...producto, [campo]: valor };
            }
            return producto;
        });

        updateState({
            productosSeleccionados: nuevosProductos
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!state.formData.id_sucursal || !state.formData.id_motivo) {
            updateState({
                error: 'Por favor, complete todos los campos requeridos'
            });
            return;
        }

        if (state.productosSeleccionados.length === 0) {
            updateState({
                error: 'Debe seleccionar al menos un producto'
            });
            return;
        }

        const productosSinUbicacion = state.productosSeleccionados.some(
            (p: ProductoSeleccionado) => p.id_ubicacion === 0
        );
        if (productosSinUbicacion) {
            updateState({
                error: 'Todos los productos deben tener una ubicación asignada'
            });
            return;
        }

        const productosCantidadInvalida = state.productosSeleccionados.some(
            (p: ProductoSeleccionado) => p.cantidad <= 0
        );
        if (productosCantidadInvalida) {
            updateState({
                error: 'La cantidad debe ser mayor a 0 para todos los productos'
            });
            return;
        }

        try {
            updateState({
                loading: true,
                error: null
            });

            const detalles = state.productosSeleccionados.map(
                ({ id_producto, cantidad, id_ubicacion }: ProductoSeleccionado) => ({
                    id_producto,
                    id_ubicacion,
                    cantidad
                })
            );

            const salida = {
                id_motivo: state.formData.id_motivo,
                id_sucursal: state.formData.id_sucursal,
                observacion: state.formData.observacion || '',
                detalles: detalles
            };

            await salidaService.registrarSalida(salida);

            resetForm();
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error al crear salida:', err);
            if (err instanceof Error) {
                if (err.message === 'No se encontró información del usuario' || 
                    err.message === 'ID de usuario no encontrado') {
                    updateState({
                        error: 'Sesión no válida. Por favor, inicie sesión nuevamente.'
                    });
                } else {
                    updateState({
                        error: err.message
                    });
                }
            } else {
                updateState({
                    error: 'Error al crear la salida'
                });
            }
        } finally {
            updateState({
                loading: false
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Registrar Salida</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="fecha">
                            Fecha
                        </label>
                        <input
                            type="date"
                            id="fecha"
                            value={state.fecha}
                            onChange={(e) => updateState({ fecha: e.target.value })}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="id_motivo">
                            Motivo de Salida
                        </label>
                        <select
                            id="id_motivo"
                            value={state.formData.id_motivo || ''}
                            onChange={(e) => updateState({
                                formData: {
                                    ...state.formData,
                                    id_motivo: Number(e.target.value)
                                }
                            })}
                            className={styles.select}
                            required
                        >
                            <option value="">Seleccione un motivo</option>
                            {state.motivos.map((motivo: Motivo) => (
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
                            value={state.formData.observacion || ''}
                            onChange={(e) => updateState({
                                formData: {
                                    ...state.formData,
                                    observacion: e.target.value
                                }
                            })}
                            className={styles.textarea}
                            placeholder="Ingrese observaciones adicionales..."
                            rows={3}
                        />
                    </div>

                        <div className={styles.sucursalesSection}>
                            <h3 className={styles.subtitle}>Seleccionar Sucursal</h3>
                            <div className={styles.sucursalList}>
                                {state.sucursales.map((sucursal: Sucursal) => (
                                    <div
                                        key={sucursal.id_sucursal}
                                        className={`${styles.sucursalCard} ${state.formData.id_sucursal === sucursal.id_sucursal ? styles.selected : ''}`}
                                        onClick={() => handleSucursalChange(sucursal.id_sucursal)}
                                    >
                                        <h4>{sucursal.nombre}</h4>
                                        {state.formData.id_sucursal === sucursal.id_sucursal && (
                                            <div className={styles.selectedIndicator}>
                                                Sucursal Seleccionada ✓
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {state.formData.id_sucursal && (
                                <div className={styles.selectedSucursalInfo}>
                                    <p>Buscando productos en: {state.sucursales.find(s => s.id_sucursal === state.formData.id_sucursal)?.nombre}</p>
                                </div>
                            )}
                        </div>                    {state.error && <div className={styles.error}>{state.error}</div>}

                    {state.formData.id_sucursal && (
                        <div className={styles.productsSection}>
                            <h3 className={styles.subtitle}>Buscar y Agregar Productos</h3>
                            <div className={styles.searchSection}>
                                <div className={styles.searchInputContainer}>
                                    <input
                                        type="text"
                                        placeholder="Buscar productos..."
                                        className={styles.searchInput}
                                        value={state.tempSearchTerm}
                                        onChange={(e) => updateState({ tempSearchTerm: e.target.value })}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleSearch();
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className={styles.searchButton}
                                        onClick={handleSearch}
                                        disabled={state.loading}
                                    >
                                        Buscar
                                    </button>
                                </div>
                                {state.loading && (
                                    <p className={styles.loadingText}>Buscando productos...</p>
                                )}
                                {state.searchResults.length > 0 && (
                                    <div className={styles.searchResults}>
                                        {state.searchResults.map((producto) => (
                                            <div key={producto.id_producto} className={styles.productCard}>
                                                <div className={styles.productInfo}>
                                                    <div className={styles.productHeader}>
                                                        <h4 className={styles.productName}>{producto.nombre_producto}</h4>
                                                        <div className={styles.productMeta}>
                                                            <span>Código: {producto.codigo_producto}</span>
                                                            <span>Precio: ${producto.precio.toFixed(2)}</span>
                                                            <span className={styles.totalStock}>
                                                                Stock Total: {producto.stock_ubicaciones.reduce((total, ub) => total + ub.stock_actual, 0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={styles.stockGrid}>
                                                        <div className={styles.stockHeader}>
                                                            <span>Ubicación</span>
                                                            <span>Stock Disponible</span>
                                                        </div>
                                                        {producto.stock_ubicaciones.map(ubicacion => (
                                                            <div key={ubicacion.id_ubicacion} className={styles.stockRow}>
                                                                <span className={styles.ubicacionName}>
                                                                    {ubicacion.nombre_ubicacion}
                                                                </span>
                                                                <span className={`${styles.stockValue} ${ubicacion.stock_actual > 0 ? styles.stockAvailable : styles.stockEmpty}`}>
                                                                    {ubicacion.stock_actual.toFixed(1)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={styles.addButton}
                                                    onClick={() => handleProductoSelect(producto)}
                                                    disabled={state.productosSeleccionados.some(p => p.id_producto === producto.id_producto)}
                                                >
                                                    Agregar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            {state.productosSeleccionados.length > 0 && (
                                <div className={styles.productosTable}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Cantidad</th>
                                                <th>Ubicación</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {state.productosSeleccionados.map((producto: ProductoSeleccionado, index: number) => (
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
                                                        <select
                                                            value={producto.id_ubicacion}
                                                            onChange={(e) => handleProductoChange(index, 'id_ubicacion', Number(e.target.value))}
                                                            className={styles.select}
                                                            required
                                                        >
                                                            <option value={0}>Seleccione ubicación</option>
                                                            {state.ubicaciones.map((ubicacion: Ubicacion) => (
                                                                <option
                                                                    key={ubicacion.id_ubicacion}
                                                                    value={ubicacion.id_ubicacion}
                                                                >
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
                        </div>
                    )}

                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelButton}
                            disabled={state.loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={state.loading}
                        >
                            {state.loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};